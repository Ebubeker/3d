import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { requireAdmin } from '@/lib/auth/admin';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendTeamWelcomeEmail } from '@/lib/email/team-welcome';

export const dynamic = 'force-dynamic';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function generatePassword(length = 16): string {
  const alphabet =
    'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  const bytes = crypto.randomBytes(length);
  let pwd = '';
  for (let i = 0; i < length; i++) pwd += alphabet[bytes[i] % alphabet.length];
  // Suffix guarantees at least one digit and one symbol so any Supabase
  // Auth password policy accepts the generated value.
  return pwd + '7!';
}

type AdminClient = ReturnType<typeof createAdminClient>;

async function findUserByEmail(admin: AdminClient, email: string) {
  const { data } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
  if (!data) return null;
  return (
    data.users.find(
      (u) => (u.email || '').toLowerCase() === email.toLowerCase()
    ) || null
  );
}

// ---------------------------------------------------------------------------
// GET — fetch credential by team_member_id
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const teamMemberId = new URL(request.url).searchParams.get('teamMemberId');
  if (!teamMemberId) {
    return NextResponse.json(
      { error: 'teamMemberId query param required' },
      { status: 400 }
    );
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from('team_credentials')
    .select('team_member_id, email, password_plaintext, updated_at')
    .eq('team_member_id', teamMemberId)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ credential: data });
}

// ---------------------------------------------------------------------------
// POST — provision or reset credentials for a team member
// ---------------------------------------------------------------------------
//
// Body: { teamMemberId: string }
//
// Behavior:
//   - Loads the team_members row (requires non-null email)
//   - If no auth user exists yet: creates one with a random password
//   - If an auth user exists: resets the password
//   - Upserts team_credentials with the new plaintext password
//   - Links team_members.user_id
//   - Ensures the user has at least the 'author' role (never demotes admin)
//
// Returns: { ok: true, email, password }
export async function POST(request: NextRequest) {
  try {
    return await provisionCredentials(request);
  } catch (err) {
    // Catch-all so the client always receives JSON even if something
    // unexpected throws (e.g. missing env vars, Supabase SDK panics).
    console.error('[credentials POST] unexpected error', err);
    const message =
      err instanceof Error ? err.message : 'Unexpected server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

async function provisionCredentials(request: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  let body: { teamMemberId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { teamMemberId } = body;
  if (!teamMemberId) {
    return NextResponse.json(
      { error: 'teamMemberId required in body' },
      { status: 400 }
    );
  }

  const admin = createAdminClient();

  const { data: member, error: memberErr } = await admin
    .from('team_members')
    .select('id, name, email, user_id')
    .eq('id', teamMemberId)
    .single();

  if (memberErr || !member) {
    return NextResponse.json(
      { error: 'Team member not found' },
      { status: 404 }
    );
  }

  if (!member.email) {
    return NextResponse.json(
      {
        error:
          'Team member has no email on file. Add an email before provisioning a login.',
      },
      { status: 400 }
    );
  }

  const password = generatePassword();
  let userId: string | null = member.user_id ?? null;

  // Track whether the member is getting a brand-new account or having
  // their existing one reset. This drives the welcome-vs-reset email
  // copy at the bottom of the handler.
  //
  // The signal is whether THIS team_member row was previously linked to
  // an auth user, NOT whether an auth user happens to exist for the
  // email address. An orphaned auth user from prior testing or an old
  // backfill shouldn't downgrade a fresh team_member's first email from
  // "welcome" to "reset" — they've never used this portal before.
  const isReset = userId !== null;

  if (!userId) {
    // No linked auth user yet — try to create one
    const { data: createData, error: createErr } =
      await admin.auth.admin.createUser({
        email: member.email,
        password,
        email_confirm: true,
        user_metadata: { name: member.name, team_member_id: member.id },
      });

    if (createErr) {
      const msg = createErr.message?.toLowerCase() || '';
      if (msg.includes('already') || msg.includes('registered')) {
        // An auth user with this email already exists — reuse it and
        // overwrite its password so the mirror table stays in sync.
        const existing = await findUserByEmail(admin, member.email);
        if (!existing) {
          return NextResponse.json(
            { error: 'Auth user exists for this email but lookup failed' },
            { status: 500 }
          );
        }
        userId = existing.id;
        const { error: updErr } = await admin.auth.admin.updateUserById(
          userId,
          { password }
        );
        if (updErr) {
          return NextResponse.json({ error: updErr.message }, { status: 500 });
        }
      } else {
        return NextResponse.json({ error: createErr.message }, { status: 500 });
      }
    } else {
      userId = createData.user?.id ?? null;
    }
  } else {
    // Already linked — just reset the password
    const { error: updErr } = await admin.auth.admin.updateUserById(userId, {
      password,
    });
    if (updErr) {
      return NextResponse.json({ error: updErr.message }, { status: 500 });
    }
  }

  if (!userId) {
    return NextResponse.json(
      { error: 'Failed to resolve auth user id' },
      { status: 500 }
    );
  }

  // Link team_members.user_id (no-op if already linked)
  const { error: linkErr } = await admin
    .from('team_members')
    .update({ user_id: userId })
    .eq('id', teamMemberId);
  if (linkErr) {
    return NextResponse.json({ error: linkErr.message }, { status: 500 });
  }

  // Upsert the plaintext mirror
  const { error: credErr } = await admin.from('team_credentials').upsert(
    {
      team_member_id: teamMemberId,
      email: member.email,
      password_plaintext: password,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'team_member_id' }
  );
  if (credErr) {
    return NextResponse.json({ error: credErr.message }, { status: 500 });
  }

  // Grant 'author' role only if no role exists yet — never demote an admin
  const { data: existingRole } = await admin
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .maybeSingle();
  if (!existingRole) {
    const { error: roleErr } = await admin
      .from('user_roles')
      .insert({ user_id: userId, role: 'author' });
    if (roleErr) {
      return NextResponse.json({ error: roleErr.message }, { status: 500 });
    }
  }

  // Fire the welcome / reset email. Failures are logged inside the helper
  // and never fail the credentials response — the admin still needs the
  // returned password even if the email bounced.
  const emailResult = await sendTeamWelcomeEmail({
    name: member.name,
    email: member.email,
    password,
    mode: isReset ? 'reset' : 'welcome',
  });

  return NextResponse.json({
    ok: true,
    email: member.email,
    password,
    emailSent: emailResult.ok,
    emailError: emailResult.ok ? undefined : emailResult.error,
  });
}
