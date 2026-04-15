import { NextRequest, NextResponse } from 'next/server';
import { requireAuthor } from '@/lib/auth/author';
import { createAdminClient } from '@/lib/supabase/admin';
import { calculateReadingTime } from '@/lib/blog/reading-time';
import {
  uniqueSlug,
  validateAuthorPostPayload,
  resolveSlug,
} from '@/lib/blog/author-posts';

export const dynamic = 'force-dynamic';

// ---------------------------------------------------------------------------
// GET — list the current author's own posts, newest first
// ---------------------------------------------------------------------------

export async function GET() {
  const auth = await requireAuthor();
  if (!auth.ok) return auth.response;

  const admin = createAdminClient();
  const { data, error } = await admin
    .from('blog_posts')
    .select('*')
    .eq('author_id', auth.teamMemberId)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ posts: data || [] });
}

interface CreatePostBody {
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
  // When true, skip draft state and go straight to pending_review.
  submit?: boolean;
}

export async function POST(request: NextRequest) {
  const auth = await requireAuthor();
  if (!auth.ok) return auth.response;

  let body: CreatePostBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const validationError = validateAuthorPostPayload(body);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const admin = createAdminClient();
  const desired = resolveSlug(body);
  if (!desired) {
    return NextResponse.json(
      { error: 'Could not generate a slug from the title' },
      { status: 400 }
    );
  }

  const slug = await uniqueSlug(admin, desired);
  const readingTime = calculateReadingTime(body.content || '');
  const reviewStatus = body.submit ? 'pending_review' : 'draft';

  const { data, error } = await admin
    .from('blog_posts')
    .insert({
      title: (body.title || '').trim(),
      slug,
      excerpt: body.excerpt?.toString().trim() || null,
      content: body.content || '',
      cover_image: body.cover_image || null,
      category: body.category?.toString().trim() || null,
      tags: Array.isArray(body.tags) ? body.tags : [],
      // Authors never publish directly — public visibility always draft
      // until an admin approves and publishes the post.
      status: 'draft',
      published_at: null,
      reading_time_minutes: readingTime,
      meta_title: body.meta_title?.toString().trim() || null,
      meta_description: body.meta_description?.toString().trim() || null,
      og_image: body.og_image || null,
      author_id: auth.teamMemberId,
      review_status: reviewStatus,
      rejection_reason: null,
    })
    .select('id')
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message || 'Failed to create post' },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, id: data.id });
}
