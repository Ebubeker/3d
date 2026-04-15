/**
 * One-time backfill script: create Supabase Auth users for every existing
 * team member, mirror the generated password into team_credentials, and
 * link team_members.user_id. Also assigns the 'author' role in user_roles.
 *
 * Usage:
 *   npx tsx scripts/backfill-team-auth.ts
 *
 * Requires: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in
 * .env.local (or environment). The service role key is mandatory — this
 * script bypasses RLS by design.
 *
 * Safe to re-run: team members that already have user_id are skipped,
 * and team_credentials upserts by team_member_id.
 *
 * Admin assignment: the script does NOT guess which user is the admin.
 * After running it, print the exact SQL you need to run in the Supabase
 * SQL Editor to mark yourself as admin after logging in at least once.
 */

import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

// ---------------------------------------------------------------------------
// Env loading (same pattern as scripts/generate-pdf-thumbnails.ts)
// ---------------------------------------------------------------------------
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) continue;
    const key = trimmed.substring(0, eqIndex).trim();
    const value = trimmed.substring(eqIndex + 1).trim();
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_APP_SUPABASE_URI;
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_APP_SUPABASE_SECRET;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function generatePassword(length = 16): string {
  // Human-friendly alphabet (no ambiguous chars) + one digit + one symbol.
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  const bytes = crypto.randomBytes(length);
  let pwd = '';
  for (let i = 0; i < length; i++) {
    pwd += alphabet[bytes[i] % alphabet.length];
  }
  // Guarantee at least one digit and one symbol so Supabase Auth accepts it
  // under any password policy.
  return pwd + '7!';
}

interface TeamMemberRow {
  id: string;
  name: string;
  email: string | null;
  user_id: string | null;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('Fetching team members...');
  const { data: members, error: membersErr } = await supabase
    .from('team_members')
    .select('id, name, email, user_id');

  if (membersErr) {
    console.error('Failed to fetch team_members:', membersErr);
    process.exit(1);
  }

  if (!members || members.length === 0) {
    console.log('No team members found. Nothing to backfill.');
    printAdminInstructions();
    return;
  }

  console.log(`Found ${members.length} team members.`);

  let created = 0;
  let skipped = 0;
  let failed = 0;

  for (const m of members as TeamMemberRow[]) {
    const label = `${m.name} (${m.email || 'no-email'})`;

    if (!m.email) {
      console.log(`  SKIP ${label} — no email on record`);
      skipped++;
      continue;
    }

    if (m.user_id) {
      console.log(`  SKIP ${label} — already linked to user_id ${m.user_id}`);
      skipped++;
      continue;
    }

    const password = generatePassword();

    // 1. Create auth user. If one already exists for that email, recover it.
    let userId: string | null = null;
    const { data: createData, error: createErr } =
      await supabase.auth.admin.createUser({
        email: m.email,
        password,
        email_confirm: true,
        user_metadata: { name: m.name, team_member_id: m.id },
      });

    if (createErr) {
      // Email already registered — look it up instead and reset the password
      // so the mirror table holds a password that actually works.
      const msg = createErr.message?.toLowerCase() || '';
      if (msg.includes('already') || msg.includes('registered')) {
        const existing = await findUserByEmail(m.email);
        if (!existing) {
          console.error(`  FAIL ${label} — create said exists but lookup failed`);
          failed++;
          continue;
        }
        userId = existing.id;
        const { error: updErr } = await supabase.auth.admin.updateUserById(
          userId,
          { password }
        );
        if (updErr) {
          console.error(`  FAIL ${label} — password reset failed: ${updErr.message}`);
          failed++;
          continue;
        }
        console.log(`  RESET ${label} — existing auth user, password replaced`);
      } else {
        console.error(`  FAIL ${label} — createUser: ${createErr.message}`);
        failed++;
        continue;
      }
    } else {
      userId = createData.user?.id || null;
    }

    if (!userId) {
      console.error(`  FAIL ${label} — no user id returned`);
      failed++;
      continue;
    }

    // 2. Link team_members.user_id
    const { error: linkErr } = await supabase
      .from('team_members')
      .update({ user_id: userId })
      .eq('id', m.id);
    if (linkErr) {
      console.error(`  FAIL ${label} — link team_members.user_id: ${linkErr.message}`);
      failed++;
      continue;
    }

    // 3. Upsert team_credentials (plaintext mirror)
    const { error: credErr } = await supabase
      .from('team_credentials')
      .upsert(
        {
          team_member_id: m.id,
          email: m.email,
          password_plaintext: password,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'team_member_id' }
      );
    if (credErr) {
      console.error(`  FAIL ${label} — upsert team_credentials: ${credErr.message}`);
      failed++;
      continue;
    }

    // 4. Assign 'author' role. Admin role is handled separately.
    const { error: roleErr } = await supabase
      .from('user_roles')
      .upsert({ user_id: userId, role: 'author' }, { onConflict: 'user_id' });
    if (roleErr) {
      console.error(`  FAIL ${label} — upsert user_roles: ${roleErr.message}`);
      failed++;
      continue;
    }

    console.log(`  OK   ${label} — password: ${password}`);
    created++;
  }

  console.log('');
  console.log(`Done. created=${created} skipped=${skipped} failed=${failed}`);
  printAdminInstructions();
}

async function findUserByEmail(email: string): Promise<{ id: string } | null> {
  // listUsers pages at 50 by default; bump and scan. For our team size
  // this is fine.
  const { data, error } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 200,
  });
  if (error || !data) return null;
  const match = data.users.find(
    (u) => (u.email || '').toLowerCase() === email.toLowerCase()
  );
  return match ? { id: match.id } : null;
}

function printAdminInstructions() {
  console.log('');
  console.log('============================================================');
  console.log('ADMIN ROLE — manual step');
  console.log('============================================================');
  console.log('After logging in to /admin at least once, run this SQL in the');
  console.log('Supabase SQL editor to mark your account as admin:');
  console.log('');
  console.log("  INSERT INTO user_roles (user_id, role)");
  console.log("  SELECT id, 'admin' FROM auth.users WHERE email = 'YOUR_ADMIN_EMAIL'");
  console.log("  ON CONFLICT (user_id) DO UPDATE SET role = 'admin';");
  console.log('');
  console.log('Replace YOUR_ADMIN_EMAIL with the email you use to sign in.');
  console.log('============================================================');
}

main().catch((err) => {
  console.error('Unhandled error:', err);
  process.exit(1);
});
