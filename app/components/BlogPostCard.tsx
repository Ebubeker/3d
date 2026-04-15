import Link from 'next/link';
import { BlogPost, BlogPostWithAuthor } from '@/lib/supabase/types';
import { formatReadingTime } from '@/lib/blog/reading-time';
import { Calendar, Clock } from 'lucide-react';

interface BlogPostCardProps {
  post: BlogPost | BlogPostWithAuthor;
}

function formatDate(iso: string | null): string {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function hasAuthor(
  post: BlogPost | BlogPostWithAuthor
): post is BlogPostWithAuthor {
  return 'author' in post;
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
  const dateStr = formatDate(post.published_at || post.created_at);
  const author = hasAuthor(post) ? post.author : null;

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-black hover:shadow-lg transition-all duration-300"
    >
      {/* Cover image */}
      <div className="relative aspect-[16/10] bg-gray-100 overflow-hidden">
        {post.cover_image ? (
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">
            No cover image
          </div>
        )}
        {post.category && (
          <span className="absolute top-4 left-4 px-3 py-1 bg-black/80 backdrop-blur-sm text-white text-xs font-medium rounded-full">
            {post.category}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-black line-clamp-2">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="text-gray-600 text-sm line-clamp-3 mb-4">
            {post.excerpt}
          </p>
        )}

        {/* Author byline */}
        {author && (
          <div className="flex items-center gap-2 mb-3">
            {author.portrait ? (
              <img
                src={author.portrait}
                alt={author.name}
                className="w-7 h-7 rounded-full object-cover"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs font-semibold">
                {author.name.slice(0, 1).toUpperCase()}
              </div>
            )}
            <span className="text-xs text-gray-700 font-medium truncate">
              {author.name}
            </span>
          </div>
        )}

        <div className="mt-auto flex items-center gap-4 text-xs text-gray-500 pt-4 border-t border-gray-100">
          {dateStr && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {dateStr}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatReadingTime(post.reading_time_minutes)}
          </span>
        </div>
      </div>
    </Link>
  );
}
