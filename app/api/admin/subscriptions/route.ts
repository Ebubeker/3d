import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/admin';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

// ---------------------------------------------------------------------------
// GET — list email subscriptions for the admin dashboard
// ---------------------------------------------------------------------------
//
// Query params:
//   q          search by email/name/company substring (case-insensitive)
//   optedIn    'true' | 'false' to filter by opt-in status
//   limit      page size (default 100, max 500)
//   offset     pagination offset
//
// Returns: { rows: Subscription[], total: number }

export async function GET(request: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const url = new URL(request.url);
  const q = url.searchParams.get('q')?.trim() || '';
  const optedInParam = url.searchParams.get('optedIn');
  const limit = Math.min(
    parseInt(url.searchParams.get('limit') || '100', 10) || 100,
    500
  );
  const offset = parseInt(url.searchParams.get('offset') || '0', 10) || 0;

  const admin = createAdminClient();

  let query = admin
    .from('email_subscriptions')
    .select(
      'id, email, name, company, source, opted_in, created_at, updated_at, unsubscribed_at',
      { count: 'exact' }
    )
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (q) {
    // ilike works as a substring match with % wildcards. Wrap user input
    // so all three columns get the same fuzzy search.
    const pattern = `%${q}%`;
    query = query.or(
      `email.ilike.${pattern},name.ilike.${pattern},company.ilike.${pattern}`
    );
  }

  if (optedInParam === 'true') query = query.eq('opted_in', true);
  else if (optedInParam === 'false') query = query.eq('opted_in', false);

  const { data, error, count } = await query;

  if (error) {
    console.error('[admin/subscriptions GET] error', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ rows: data || [], total: count ?? 0 });
}
