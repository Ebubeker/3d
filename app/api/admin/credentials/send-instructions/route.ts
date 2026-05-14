import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/admin';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendTeamWelcomeEmail } from '@/lib/email/team-welcome';

export const dynamic = 'force-dynamic';

// ---------------------------------------------------------------------------
// POST — re-send the existing credentials with a blog how-to walkthrough
// ---------------------------------------------------------------------------
//
// Body: { teamMemberId: string }
//
// Unlike /api/admin/credentials POST, this never rotates the password.
// It loads the stored plaintext password from team_credentials and emails
// the team member a nudge with the same credentials plus a step-by-step
// guide on how to publish a blog post. Used by admins to encourage team
// members who haven't started writing yet.

export async function POST(request: NextRequest) {
  try {
    return await sendInstructions(request);
  } catch (err) {
    console.error('[credentials/send-instructions] unexpected error', err);
    const message =
      err instanceof Error ? err.message : 'Unexpected server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

async function sendInstructions(request: NextRequest) {
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
    .select('id, name, email')
    .eq('id', teamMemberId)
    .single();

  if (memberErr || !member) {
    return NextResponse.json(
      { error: 'Team member not found' },
      { status: 404 }
    );
  }

  const { data: cred, error: credErr } = await admin
    .from('team_credentials')
    .select('email, password_plaintext')
    .eq('team_member_id', teamMemberId)
    .maybeSingle();

  if (credErr) {
    return NextResponse.json({ error: credErr.message }, { status: 500 });
  }
  if (!cred) {
    return NextResponse.json(
      {
        error:
          'No credentials have been generated for this team member yet. Click "Generate Login" first.',
      },
      { status: 400 }
    );
  }

  // Use the stored email from team_credentials as the recipient — that's
  // the one their auth account was provisioned against, which may differ
  // from team_members.email if it was edited later without a re-provision.
  const result = await sendTeamWelcomeEmail({
    name: member.name,
    email: cred.email,
    password: cred.password_plaintext,
    mode: 'instructions',
  });

  if (!result.ok) {
    return NextResponse.json(
      { error: result.error || 'Failed to send email' },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, email: cred.email });
}
