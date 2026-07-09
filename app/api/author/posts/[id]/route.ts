import { NextRequest, NextResponse } from 'next/server';
import { requireAuthor } from '@/lib/auth/author';
import { createAdminClient } from '@/lib/supabase/admin';
import { calculateReadingTime } from '@/lib/blog/reading-time';
import {
  uniqueSlug,
  validateAuthorPostPayload,
  resolveSlug,
} from '@/lib/blog/author-posts';
import { sendPostSubmittedEmail } from '@/lib/email/post-submitted';

export const dynamic = 'force-dynamic';

type AdminClient = ReturnType<typeof createAdminClient>;

interface UpdatePostBody {
  title?: string;
  slug?: string;
  excerpt?: string | null;
  content?: string;
  cover_image?: string | null;
  category?: string | null;
  tags?: string[];
  meta_title?: string | null;
  meta_description?: string | null;
  og_image?: string | null;
  // When true, the updated post transitions from draft/rejected to pending_review.
  submit?: boolean;
}

async function loadOwnPost(
  admin: AdminClient,
  id: string,
  teamMemberId: string
) {
  const { data, error } = await admin
    .from('blog_posts')
    .select('id, author_id, review_status')
    .eq('id', id)
    .maybeSingle();
  if (error) return { error: error.message, status: 500 as const };
  if (!data) return { error: 'Post not found', status: 404 as const };
  if (data.author_id !== teamMemberId) {
    return { error: 'You can only modify your own posts', status: 403 as const };
  }
  return { data };
}

// ---------------------------------------------------------------------------
// GET — load a single owned post for editing
// ---------------------------------------------------------------------------

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuthor();
  if (!auth.ok) return auth.response;

  const { id } = await context.params;
  const admin = createAdminClient();

  const { data, error } = await admin
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }
  if (data.author_id !== auth.teamMemberId) {
    return NextResponse.json(
      { error: 'You can only view your own posts' },
      { status: 403 }
    );
  }

  return NextResponse.json({ post: data });
}

// ---------------------------------------------------------------------------
// PATCH — update an owned post (allowed only in draft or rejected state)
// ---------------------------------------------------------------------------

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuthor();
  if (!auth.ok) return auth.response;

  const { id } = await context.params;
  const admin = createAdminClient();

  const owned = await loadOwnPost(admin, id, auth.teamMemberId);
  if ('error' in owned) {
    return NextResponse.json({ error: owned.error }, { status: owned.status });
  }

  const currentStatus = owned.data.review_status as string;
  if (currentStatus !== 'draft' && currentStatus !== 'rejected') {
    return NextResponse.json(
      {
        error: `Cannot edit a post with review status '${currentStatus}'. Ask an admin to move it back to draft.`,
      },
      { status: 409 }
    );
  }

  let body: UpdatePostBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const validationError = validateAuthorPostPayload(body);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const desired = resolveSlug(body);
  if (!desired) {
    return NextResponse.json(
      { error: 'Could not generate a slug from the title' },
      { status: 400 }
    );
  }

  const slug = await uniqueSlug(admin, desired, id);
  const readingTime = calculateReadingTime(body.content || '');
  const newReviewStatus = body.submit ? 'pending_review' : 'draft';

  const updates: Record<string, unknown> = {
    title: (body.title || '').trim(),
    slug,
    excerpt: body.excerpt?.toString().trim() || null,
    content: body.content || '',
    cover_image: body.cover_image || null,
    category: body.category?.toString().trim() || null,
    tags: Array.isArray(body.tags) ? body.tags : [],
    reading_time_minutes: readingTime,
    meta_title: body.meta_title?.toString().trim() || null,
    meta_description: body.meta_description?.toString().trim() || null,
    og_image: body.og_image || null,
    review_status: newReviewStatus,
  };

  // When resubmitting, clear the old rejection note so the admin's review
  // page isn't cluttered. When saving as draft again, keep it visible so
  // the author still sees the feedback they're working against.
  if (newReviewStatus === 'pending_review') {
    updates.rejection_reason = null;
  }

  const { error } = await admin
    .from('blog_posts')
    .update(updates)
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Notify the team inbox when this update is a submit-for-review. Only on the
  // draft/rejected -> pending_review transition (re-saving an already-pending
  // post can't reach here — PATCH is blocked for non-draft/rejected states).
  if (newReviewStatus === 'pending_review') {
    const { data: member } = await admin
      .from('team_members')
      .select('name')
      .eq('id', auth.teamMemberId)
      .maybeSingle();
    await sendPostSubmittedEmail({
      postId: id,
      title: (body.title || '').trim(),
      authorName: member?.name?.toString().trim() || 'A team member',
      excerpt: body.excerpt?.toString().trim() || null,
      category: body.category?.toString().trim() || null,
    });
  }

  return NextResponse.json({ ok: true, submitted: newReviewStatus === 'pending_review' });
}

// ---------------------------------------------------------------------------
// DELETE — delete an owned post (not allowed for published posts)
// ---------------------------------------------------------------------------

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuthor();
  if (!auth.ok) return auth.response;

  const { id } = await context.params;
  const admin = createAdminClient();

  const owned = await loadOwnPost(admin, id, auth.teamMemberId);
  if ('error' in owned) {
    return NextResponse.json({ error: owned.error }, { status: owned.status });
  }

  if (owned.data.review_status === 'published') {
    return NextResponse.json(
      { error: 'Published posts can only be removed by an admin' },
      { status: 409 }
    );
  }

  const { error } = await admin.from('blog_posts').delete().eq('id', id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
