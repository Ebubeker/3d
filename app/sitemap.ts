import type { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';
import { BlogPost } from '@/lib/supabase/types';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://virtuality.fashion';

// Rebuild the sitemap on every request so newly published blog posts
// appear immediately without requiring a redeploy.
export const dynamic = 'force-dynamic';

type ChangeFreq = MetadataRoute.Sitemap[number]['changeFrequency'];

interface StaticRoute {
  path: string;
  changeFrequency: ChangeFreq;
  priority: number;
}

// Public, indexable routes. Admin and API routes are intentionally excluded.
const STATIC_ROUTES: StaticRoute[] = [
  { path: '', changeFrequency: 'weekly', priority: 1.0 },
  { path: '/solutions', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/team', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/blog', changeFrequency: 'daily', priority: 0.9 },
  { path: '/about', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/contact', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/projects', changeFrequency: 'weekly', priority: 0.7 },
  { path: '/experts', changeFrequency: 'weekly', priority: 0.7 },
  { path: '/marketplace', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/join-team', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/join', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/inquiry', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/privacy', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/terms', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/cookies', changeFrequency: 'yearly', priority: 0.3 },
];

async function getPublishedPosts(): Promise<Pick<BlogPost, 'slug' | 'updated_at' | 'published_at'>[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('blog_posts')
      .select('slug, updated_at, published_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (error) {
      console.error('Sitemap: failed to fetch blog posts', error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error('Sitemap: blog post query threw', err);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const posts = await getPublishedPosts();
  const blogEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.updated_at || post.published_at || now),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticEntries, ...blogEntries];
}
