import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/admin';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

const STORAGE_BUCKET = 'team-member-files';

// Signed URL lifetime for downloads. Short enough that links can't be
// casually shared; long enough to complete a click -> new-tab -> download.
const SIGNED_URL_TTL_SECONDS = 60;

interface RouteContext {
  params: Promise<{ id: string }>;
}

// ---------------------------------------------------------------------------
// GET — return a short-lived signed download URL for the file
// ---------------------------------------------------------------------------

export async function GET(_request: NextRequest, context: RouteContext) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const { id } = await context.params;

  const admin = createAdminClient();
  const { data: row, error } = await admin
    .from('team_member_files')
    .select('storage_path, file_name')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!row) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }

  const { data: signed, error: signErr } = await admin.storage
    .from(STORAGE_BUCKET)
    .createSignedUrl(row.storage_path, SIGNED_URL_TTL_SECONDS, {
      download: row.file_name,
    });

  if (signErr || !signed) {
    return NextResponse.json(
      { error: signErr?.message || 'Failed to sign URL' },
      { status: 500 }
    );
  }

  return NextResponse.json({ url: signed.signedUrl });
}

// ---------------------------------------------------------------------------
// DELETE — remove the metadata row and the storage object
// ---------------------------------------------------------------------------

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const { id } = await context.params;

  const admin = createAdminClient();
  const { data: row, error } = await admin
    .from('team_member_files')
    .select('storage_path')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!row) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }

  // Delete the metadata row first. If this fails the storage object is
  // still reachable, which is the safer side of the trade-off — we never
  // end up with a dangling row whose blob has already been removed.
  const { error: deleteRowErr } = await admin
    .from('team_member_files')
    .delete()
    .eq('id', id);

  if (deleteRowErr) {
    return NextResponse.json({ error: deleteRowErr.message }, { status: 500 });
  }

  const { error: storageErr } = await admin.storage
    .from(STORAGE_BUCKET)
    .remove([row.storage_path]);

  if (storageErr) {
    // Row is already gone — log but don't fail the request. A cleanup
    // script can sweep orphaned storage objects if this becomes common.
    console.error(
      '[team-files DELETE] storage remove failed (row already deleted)',
      storageErr
    );
  }

  return NextResponse.json({ ok: true });
}
