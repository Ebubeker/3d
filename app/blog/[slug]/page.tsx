import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import BlogContent from '../../components/BlogContent';
import BlogPostCard from '../../components/BlogPostCard';
import { createClient } from '@/lib/supabase/server';
import { BlogPost, BlogPostWithAuthor } from '@/lib/supabase/types';
import { formatReadingTime } from '@/lib/blog/reading-time';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';

const SITE_NAME = 'Virtuality Fashion';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://virtuality.fashion';
const DEFAULT_OG_IMAGE = `${SITE_URL}/images/og-image.jpg`;

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Defensive: if the PostgREST embedded select ever fails to resolve the FK
// (wrong constraint name, permissions, etc.) we fall back to an explicit
// second query using author_id. Either way the UI gets a populated author.
async function attachAuthors<T extends BlogPost & { author?: unknown }>(
  posts: T[]
): Promise<BlogPostWithAuthor[]> {
  const supabase = await createClient();
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
  // Normalize the shape: ensure every post has an `author` key (null if none)
  return posts.map((p) => ({
    ...(p as unknown as BlogPost),
    author:
      (p as unknown as BlogPostWithAuthor).author &&
      typeof (p as unknown as BlogPostWithAuthor).author === 'object'
        ? (p as unknown as BlogPostWithAuthor).author
        : null,
  }));
}

async function getPost(slug: string): Promise<BlogPostWithAuthor | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*, author:team_members(id, name, portrait, role)')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();

  if (error || !data) return null;
  const [withAuthor] = await attachAuthors([data as unknown as BlogPost]);
  return withAuthor;
}

async function getRelatedPosts(
  post: BlogPost,
  limit = 3
): Promise<BlogPostWithAuthor[]> {
  const supabase = await createClient();
  let query = supabase
    .from('blog_posts')
    .select('*, author:team_members(id, name, portrait, role)')
    .eq('status', 'published')
    .neq('id', post.id)
    .order('published_at', { ascending: false })
    .limit(limit);

  if (post.category) {
    query = query.eq('category', post.category);
  }

  const { data } = await query;
  return attachAuthors((data || []) as unknown as BlogPost[]);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return {
      title: 'Post not found',
    };
  }

  const title = post.meta_title || post.title;
  const description = post.meta_description || post.excerpt || '';
  const image = post.og_image || post.cover_image || DEFAULT_OG_IMAGE;
  const url = `${SITE_URL}/blog/${post.slug}`;

  return {
    title: `${title} | ${SITE_NAME} Blog`,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: 'article',
      url,
      title,
      description,
      siteName: SITE_NAME,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      publishedTime: post.published_at || undefined,
      modifiedTime: post.updated_at,
      authors: [post.author?.name || SITE_NAME],
      tags: post.tags || undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

function formatDate(iso: string | null): string {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(post);
  const url = `${SITE_URL}/blog/${post.slug}`;
  const image = post.og_image || post.cover_image;

  // JSON-LD BlogPosting schema for Google rich results. When a team member
  // authored the post, attribute them as a Person; otherwise fall back to the
  // organization byline.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.meta_description || post.excerpt || '',
    image: image ? [image] : undefined,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    author: post.author
      ? {
          '@type': 'Person',
          name: post.author.name,
          image: post.author.portrait || undefined,
          jobTitle: post.author.role || undefined,
          worksFor: {
            '@type': 'Organization',
            name: SITE_NAME,
            url: SITE_URL,
          },
        }
      : {
          '@type': 'Organization',
          name: SITE_NAME,
          url: SITE_URL,
        },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    articleSection: post.category || undefined,
    keywords: (post.tags || []).join(', ') || undefined,
  };

  return (
    <>
      <Header />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <article className="bg-white">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-12 pt-24 sm:pt-32 pb-10 md:pt-40 md:pb-14">
            <Link
              href="/blog"
              className="flex w-fit items-center text-gray-600 hover:text-black mb-6 sm:mb-10 transition-colors group text-sm sm:text-base"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Blog
            </Link>

            {post.category && (
              <span className="inline-block px-3 py-1 bg-black text-white text-xs font-medium rounded-full mb-4">
                {post.category}
              </span>
            )}

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="text-lg sm:text-xl text-gray-600 mb-6 leading-relaxed">
                {post.excerpt}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-x-4 gap-y-3 text-sm text-gray-500">
              {post.author ? (
                <span className="flex items-center gap-2">
                  {post.author.portrait ? (
                    <img
                      src={post.author.portrait}
                      alt={post.author.name}
                      className="w-9 h-9 rounded-full object-cover"
                    />
                  ) : (
                    <span className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm font-semibold">
                      {post.author.name.slice(0, 1).toUpperCase()}
                    </span>
                  )}
                  <span className="flex flex-col leading-tight">
                    <span className="text-gray-900 font-medium">
                      {post.author.name}
                    </span>
                    {post.author.role && (
                      <span className="text-xs text-gray-500">
                        {post.author.role}
                      </span>
                    )}
                  </span>
                </span>
              ) : (
                <span>{SITE_NAME}</span>
              )}
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(post.published_at)}
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {formatReadingTime(post.reading_time_minutes)}
              </span>
            </div>
          </div>
        </header>

        {/* Cover image */}
        {post.cover_image && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-12 mt-8 flex justify-center">
            <img
              src={post.cover_image}
              alt={post.title}
              className="max-w-full max-h-[600px] rounded-2xl shadow-lg"
            />
          </div>
        )}

        {/* Body */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 md:px-12 py-12 sm:py-16">
          <BlogContent html={post.content} />

          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <section className="bg-gray-50 border-t border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12 py-14 sm:py-20">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
              Keep Reading
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((p) => (
                <BlogPostCard key={p.id} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </>
  );
}
