import { NextResponse } from 'next/server';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export type AuthorAuthFailure = { ok: false; response: NextResponse };
export type AuthorAuthSuccess = {
  ok: true;
  userId: string;
  teamMemberId: string;
};
export type AuthorAuthResult = AuthorAuthFailure | AuthorAuthSuccess;

/**
 * Guard helper for /api/author/* routes.
 *
 * Resolves the caller's Supabase Auth session from cookies, then looks up
 * the linked team_member row via the service-role client (so stricter RLS
 * in future phases doesn't break the lookup).
 *
 * A caller is an "author" if and only if they have a team_members row
 * with user_id = their auth uid. Admins who also happen to have a
 * team_members row pass this check as well, which is intentional —
 * admin-portal routes use requireAdmin() separately.
 */
export async function requireAuthor(): Promise<AuthorAuthResult> {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      ),
    };
  }

  const admin = createAdminClient();
  const { data: member, error } = await admin
    .from('team_members')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) {
    return {
      ok: false,
      response: NextResponse.json({ error: error.message }, { status: 500 }),
    };
  }

  if (!member) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: 'No team member linked to this account' },
        { status: 403 }
      ),
    };
  }

  return { ok: true, userId: user.id, teamMemberId: member.id };
}
