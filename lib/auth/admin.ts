import { NextResponse } from 'next/server';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export type AdminAuthFailure = { ok: false; response: NextResponse };
export type AdminAuthSuccess = { ok: true; userId: string };
export type AdminAuthResult = AdminAuthFailure | AdminAuthSuccess;

/**
 * Guard helper for admin API routes.
 *
 * Verifies that the caller is logged in via Supabase cookies AND has
 * role='admin' in the user_roles table. Returns either the user id or
 * a NextResponse the route should return directly.
 *
 * Usage:
 *   export async function POST(req: NextRequest) {
 *     const auth = await requireAdmin();
 *     if (!auth.ok) return auth.response;
 *     // ... admin work ...
 *   }
 */
export async function requireAdmin(): Promise<AdminAuthResult> {
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

  // Use the service-role client to read user_roles so stricter policies
  // in Phase 3 can't block the admin check.
  const admin = createAdminClient();
  const { data: roleRow, error } = await admin
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) {
    return {
      ok: false,
      response: NextResponse.json({ error: error.message }, { status: 500 }),
    };
  }

  if (!roleRow || roleRow.role !== 'admin') {
    return {
      ok: false,
      response: NextResponse.json(
        {
          error:
            'Admin role required. Ask an existing admin to grant your account in user_roles.',
        },
        { status: 403 }
      ),
    };
  }

  return { ok: true, userId: user.id };
}
