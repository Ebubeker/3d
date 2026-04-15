import { createAdminClient } from '@/lib/supabase/admin';
import { generateSlug } from '@/lib/blog/slug';

type AdminClient = ReturnType<typeof createAdminClient>;

/**
 * Find a slug that is unique in blog_posts. If `excludeId` is provided
 * (edit mode), that row is ignored.
 *
 * Uses the service-role client — intended for server routes only.
 */
export async function uniqueSlug(
  admin: AdminClient,
  desired: string,
  excludeId?: string
): Promise<string> {
  let candidate = desired;
  let counter = 2;
  // Hard cap on iterations so a pathological dataset cannot spin forever.
  for (let i = 0; i < 1000; i++) {
    const query = admin
      .from('blog_posts')
      .select('id')
      .eq('slug', candidate)
      .limit(1);
    const { data } = excludeId
      ? await query.neq('id', excludeId)
      : await query;
    if (!data || data.length === 0) return candidate;
    candidate = `${desired}-${counter}`;
    counter += 1;
  }
  throw new Error('Could not find a unique slug after 1000 attempts');
}

/**
 * Validate the shape of a post payload coming from the author portal.
 * Returns a user-facing error string on failure, or null on success.
 */
export function validateAuthorPostPayload(body: {
  title?: unknown;
  content?: unknown;
}): string | null {
  const title = typeof body.title === 'string' ? body.title.trim() : '';
  if (!title) return 'Title is required';
  const content = typeof body.content === 'string' ? body.content : '';
  if (!content.trim() || content === '<p></p>') return 'Content is required';
  return null;
}

/**
 * Normalize and generate the final slug for a post payload.
 * Prefers the user-supplied slug, falls back to generating one from the title.
 */
export function resolveSlug(body: {
  slug?: unknown;
  title?: unknown;
}): string {
  const suppliedSlug =
    typeof body.slug === 'string' ? generateSlug(body.slug) : '';
  if (suppliedSlug) return suppliedSlug;
  const title = typeof body.title === 'string' ? body.title : '';
  return generateSlug(title);
}
