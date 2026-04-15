import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { requireAdmin } from '@/lib/auth/admin';
import { createAdminClient } from '@/lib/supabase/admin';
import type { TeamMemberFileCategory } from '@/lib/supabase/types';

export const dynamic = 'force-dynamic';

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const STORAGE_BUCKET = 'team-member-files';
const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB

// Allowed MIME types: PDFs, common images, Office docs, CSV, plain text.
const ALLOWED_MIME_TYPES = new Set<string>([
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/csv',
  'text/plain',
]);

const VALID_CATEGORIES = new Set<TeamMemberFileCategory>([
  'contract',
  'invoice',
  'tax',
  'payment',
  'other',
]);

function sanitizeExt(name: string): string {
  const dot = name.lastIndexOf('.');
  if (dot === -1) return 'bin';
  const ext = name.slice(dot + 1).toLowerCase();
  // Only keep letters/digits — strip anything weird
  return ext.replace(/[^a-z0-9]/g, '').slice(0, 10) || 'bin';
}

// ---------------------------------------------------------------------------
// GET — list files for a team member
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
    .from('team_member_files')
    .select('*')
    .eq('team_member_id', teamMemberId)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ files: data || [] });
}

// ---------------------------------------------------------------------------
// POST — upload a new file (multipart/form-data)
// ---------------------------------------------------------------------------
//
// Form fields:
//   file         (required, binary)
//   teamMemberId (required)
//   category     (required, one of contract|invoice|tax|payment|other)
//   label        (optional)
//   notes        (optional)

export async function POST(request: NextRequest) {
  try {
    return await uploadFile(request);
  } catch (err) {
    // Catch-all: client must always get JSON even on unexpected throws
    // (missing env vars, storage SDK panics, etc.).
    console.error('[team-files POST] unexpected error', err);
    const message =
      err instanceof Error ? err.message : 'Unexpected server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

async function uploadFile(request: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  const teamMemberId = formData.get('teamMemberId') as string | null;
  const categoryRaw = (formData.get('category') as string | null) || 'other';
  const label = (formData.get('label') as string | null) || null;
  const notes = (formData.get('notes') as string | null) || null;

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }
  if (!teamMemberId) {
    return NextResponse.json(
      { error: 'teamMemberId required' },
      { status: 400 }
    );
  }

  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    return NextResponse.json(
      {
        error: `File type "${file.type || 'unknown'}" is not allowed. Accepted: PDF, images, Word, Excel, CSV, TXT.`,
      },
      { status: 400 }
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: `File exceeds the 25 MB limit.` },
      { status: 400 }
    );
  }

  const category = VALID_CATEGORIES.has(categoryRaw as TeamMemberFileCategory)
    ? (categoryRaw as TeamMemberFileCategory)
    : 'other';

  const admin = createAdminClient();

  // Verify the team member exists — otherwise we'd end up with orphaned
  // storage objects that violate the FK on insert.
  const { data: member, error: memberErr } = await admin
    .from('team_members')
    .select('id')
    .eq('id', teamMemberId)
    .maybeSingle();

  if (memberErr) {
    return NextResponse.json({ error: memberErr.message }, { status: 500 });
  }
  if (!member) {
    return NextResponse.json(
      { error: 'Team member not found' },
      { status: 404 }
    );
  }

  // Path convention: <teamMemberId>/<timestamp>-<random>.<ext>
  // The team_member_id prefix keeps files grouped so deletions on member
  // removal cascade cleanly if we ever script a storage purge.
  const ext = sanitizeExt(file.name);
  const random = crypto.randomBytes(6).toString('hex');
  const storagePath = `${teamMemberId}/${Date.now()}-${random}.${ext}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { error: uploadErr } = await admin.storage
    .from(STORAGE_BUCKET)
    .upload(storagePath, buffer, {
      contentType: file.type,
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadErr) {
    console.error('[team-files POST] storage upload error', uploadErr);
    return NextResponse.json({ error: uploadErr.message }, { status: 500 });
  }

  // Insert metadata row. If this fails, roll back the storage object so we
  // don't leak orphaned blobs.
  const { data: row, error: insertErr } = await admin
    .from('team_member_files')
    .insert({
      team_member_id: teamMemberId,
      file_name: file.name,
      storage_path: storagePath,
      file_size: file.size,
      mime_type: file.type,
      label,
      category,
      notes,
      uploaded_by: auth.userId,
    })
    .select('*')
    .single();

  if (insertErr) {
    console.error('[team-files POST] metadata insert error', insertErr);
    // Best-effort rollback of the uploaded blob
    await admin.storage.from(STORAGE_BUCKET).remove([storagePath]);
    return NextResponse.json({ error: insertErr.message }, { status: 500 });
  }

  return NextResponse.json({ file: row });
}
