import { createClient } from '@/lib/supabase/client';

/**
 * Generate a URL-friendly slug from a title.
 * e.g. "Hello, World!" -> "hello-world"
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accents
    .replace(/[^a-z0-9\s-]/g, '') // remove non-alphanumerics
    .replace(/\s+/g, '-') // spaces -> dashes
    .replace(/-+/g, '-') // collapse multiple dashes
    .replace(/^-|-$/g, ''); // trim leading/trailing dashes
}

/**
 * Ensure a slug is unique in the blog_posts table.
 * If `excludeId` is provided (edit mode), that row is ignored.
 * Returns the original slug if unique, or slug-2, slug-3, ... if taken.
 */
export async function ensureUniqueSlug(
  slug: string,
  excludeId?: string
): Promise<string> {
  const supabase = createClient();
  let candidate = slug;
  let counter = 2;

  while (true) {
    const query = supabase
      .from('blog_posts')
      .select('id')
      .eq('slug', candidate);

    const { data } = excludeId
      ? await query.neq('id', excludeId)
      : await query;

    if (!data || data.length === 0) {
      return candidate;
    }

    candidate = `${slug}-${counter}`;
    counter += 1;
  }
}
