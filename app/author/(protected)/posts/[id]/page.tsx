'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import AuthorPostForm from '@/app/author/AuthorPostForm';
import { BlogPost } from '@/lib/supabase/types';

export default function EditAuthorPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/author/posts/${id}`, {
          cache: 'no-store',
        });
        const json = await res.json();
        if (!res.ok) {
          throw new Error(json.error || 'Failed to load post');
        }
        setPost(json.post as BlogPost);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load post');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id]);

  if (isLoading) {
    return (
      <div className="text-center py-16">
        <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Loading post...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div>
        <Link
          href="/author/dashboard"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-black mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to my posts
        </Link>
        <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error || 'Post not found'}
        </div>
      </div>
    );
  }

  return <AuthorPostForm mode="edit" initialPost={post} />;
}
