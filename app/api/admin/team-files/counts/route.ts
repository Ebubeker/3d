import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/admin';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

// Returns a map of team_member_id -> file count for every member that has
// at least one private document. Used by the admin team list to render
// the document indicator next to each row at a glance.
//
// Members with zero files are omitted so the client doesn't have to
// filter — a missing key implicitly means zero.
export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const admin = createAdminClient();
  const { data, error } = await admin
    .from('team_member_files')
    .select('team_member_id');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const counts: Record<string, number> = {};
  for (const row of data || []) {
    const id = (row as { team_member_id: string }).team_member_id;
    counts[id] = (counts[id] || 0) + 1;
  }

  return NextResponse.json({ counts });
}
