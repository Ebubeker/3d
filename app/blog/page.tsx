import type { Metadata } from 'next';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BlogListClient from './BlogListClient';
import { createClient } from '@/lib/supabase/server';
import { BlogPost, BlogPostWithAuthor } from '@/lib/supabase/types';
import { OG_IMAGES } from '@/lib/seo/schema';
import { SITE_URL } from '@/lib/site';

const SITE_NAME = 'virtuality.fashion';

const PAGE_TITLE = 'Blog | virtuality.fashion';
const PAGE_DESCRIPTION =
  'Practical insights on fashion product development, tech packs, virtual sampling, and working with on-demand teams.';

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: `${SITE_URL}/blog`,
    types: {
      'application/rss+xml': `${SITE_URL}/blog/rss.xml`,
    },
  },
  openGraph: {
    type: 'website',
    url: `${SITE_URL}/blog`,
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    siteName: SITE_NAME,
    images: OG_IMAGES,
  },
  twitter: {
    card: 'summary_large_image',
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
  },
};

// Force dynamic rendering so new posts show up immediately without a redeploy.
export const dynamic = 'force-dynamic';

async function getPublishedPosts(): Promise<BlogPostWithAuthor[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*, author:team_members(id, name, portrait, role)')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }

  // Defensive fallback: if the embedded select returns null for author on
  // any row that has an author_id, do a second batched query by id.
  const posts = (data || []) as unknown as (BlogPost & {
    author?: unknown;
  })[];
  const missing = posts.filter(
    (p) => p.author_id && (!p.author || typeof p.author !== 'object')
  );
  if (missing.length > 0) {
    const ids = Array.from(new Set(missing.map((p) => p.author_id as string)));
    const { data: members } = await supabase
      .from('team_members')
      .select('id, name, portrait, role')
      .in('id', ids);
    const byId = new Map((members || []).map((m) => [m.id, m]));
    for (const p of missing) {
      (p as unknown as BlogPostWithAuthor).author =
        byId.get(p.author_id as string) || null;
    }
  }
  // Normalize every row to the final shape
  return posts.map((p) => ({
    ...(p as unknown as BlogPost),
    author:
      (p as unknown as BlogPostWithAuthor).author &&
      typeof (p as unknown as BlogPostWithAuthor).author === 'object'
        ? (p as unknown as BlogPostWithAuthor).author
        : null,
  }));
}

export default async function BlogListPage() {
  const posts = await getPublishedPosts();

  return (
    <>
      <Header />

      {/* Hero */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12 pt-24 sm:pt-32 pb-10 sm:pb-14 md:pt-40 md:pb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Blog
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl">
            {PAGE_DESCRIPTION}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="bg-gray-50 min-h-[60vh]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12 py-10 sm:py-14">
          <BlogListClient posts={posts} />
        </div>
      </section>

      <Footer />
    </>
  );
}
