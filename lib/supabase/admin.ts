import { createClient } from '@supabase/supabase-js';

/**
 * Service-role Supabase client for admin-only server routes.
 *
 * Bypasses RLS — never expose this client to the browser. Only import
 * from server files (route handlers, server actions, scripts).
 *
 * Reads the service role key from either `SUPABASE_SERVICE_ROLE_KEY`
 * (standard name) or `NEXT_APP_SUPABASE_SECRET` (legacy name used by
 * this project's existing .env.local and /api/upload route). Reads the
 * project URL from either `NEXT_PUBLIC_SUPABASE_URL` or the legacy
 * `NEXT_APP_SUPABASE_URI`.
 */
export function createAdminClient() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.NEXT_APP_SUPABASE_URI;
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_APP_SUPABASE_SECRET;
  if (!url || !serviceKey) {
    throw new Error(
      'createAdminClient: Supabase URL and service role key are required. ' +
        'Set SUPABASE_SERVICE_ROLE_KEY (or NEXT_APP_SUPABASE_SECRET) and ' +
        'NEXT_PUBLIC_SUPABASE_URL (or NEXT_APP_SUPABASE_URI) in .env.local.'
    );
  }
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
