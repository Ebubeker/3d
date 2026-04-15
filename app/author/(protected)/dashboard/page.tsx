'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { BlogPost, BlogReviewStatus } from '@/lib/supabase/types';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Clock,
  AlertCircle,
  Eye,
  ExternalLink,
} from 'lucide-react';

type ReviewTab = 'all' | 'draft' | 'pending_review' | 'published' | 'rejected';

const REVIEW_BADGE_STYLE: Record<BlogReviewStatus, string> = {
  draft: 'bg-amber-100 text-amber-700',
  pending_review: 'bg-blue-100 text-blue-700',
  published: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
};

const REVIEW_LABEL: Record<BlogReviewStatus, string> = {
  draft: 'draft',
  pending_review: 'pending review',
  published: 'published',
  rejected: 'rejected',
};

export default function AuthorDashboardPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [reviewTab, setReviewTab] = useState<ReviewTab>('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('/api/author/posts', { cache: 'no-store' });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Failed to load posts');
      }
      setPosts((json.posts || []) as BlogPost[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load posts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/author/posts/${id}`, { method: 'DELETE' });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(json.error || 'Failed to delete post');
      }
      setPosts((prev) => prev.filter((p) => p.id !== id));
      setDeleteId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete post');
    } finally {
      setIsDeleting(false);
    }
  };

  const counts = useMemo(() => {
    const c: Record<ReviewTab, number> = {
      all: posts.length,
      draft: 0,
      pending_review: 0,
      published: 0,
      rejected: 0,
    };
    for (const p of posts) {
      const key = (p.review_status || 'draft') as BlogReviewStatus;
      c[key] = (c[key] || 0) + 1;
    }
    return c;
  }, [posts]);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const rs = (post.review_status || 'draft') as BlogReviewStatus;
      if (reviewTab !== 'all' && rs !== reviewTab) return false;
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        post.title.toLowerCase().includes(q) ||
        (post.category || '').toLowerCase().includes(q)
      );
    });
  }, [posts, reviewTab, searchQuery]);

  const tabs: { id: ReviewTab; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'draft', label: 'Drafts' },
    { id: 'rejected', label: 'Needs Revision' },
    { id: 'pending_review', label: 'Pending' },
    { id: 'published', label: 'Published' },
  ];

  const rejectedCount = counts.rejected;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Posts</h1>
          <p className="text-gray-600 mt-1">
            Write drafts, submit them for review, and track your published work.
          </p>
        </div>
        <Link
          href="/author/posts/new"
          className="flex items-center justify-center gap-2 px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Write New
        </Link>
      </div>

      {/* Global revision nudge */}
      {rejectedCount > 0 && reviewTab !== 'rejected' && (
        <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-red-900">
              {rejectedCount === 1
                ? 'One of your posts needs revision.'
                : `${rejectedCount} of your posts need revision.`}
            </p>
            <button
              type="button"
              onClick={() => setReviewTab('rejected')}
              className="text-sm text-red-700 underline hover:text-red-900 mt-1"
            >
              View posts that need revision →
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Search + review tabs */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search your posts..."
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors text-black"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {tabs.map((tab) => {
            const count = counts[tab.id];
            const isRejected = tab.id === 'rejected';
            return (
              <button
                key={tab.id}
                onClick={() => setReviewTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  reviewTab === tab.id
                    ? 'bg-black text-white'
                    : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-black'
                }`}
              >
                {tab.label}
                <span
                  className={`inline-flex items-center justify-center min-w-[1.5rem] h-5 px-1.5 rounded-full text-xs font-semibold ${
                    reviewTab === tab.id
                      ? 'bg-white text-black'
                      : isRejected && count > 0
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Posts list */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading posts...</p>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-600 mb-4">
            {posts.length === 0
              ? "You haven't written any posts yet."
              : 'No posts match your filters.'}
          </p>
          {posts.length === 0 && (
            <Link
              href="/author/posts/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Write Your First Post
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {filteredPosts.map((post) => {
              const rs = (post.review_status || 'draft') as BlogReviewStatus;
              const canEdit = rs === 'draft' || rs === 'rejected';
              const canDelete = rs !== 'published';
              return (
                <li
                  key={post.id}
                  className="flex items-start gap-4 px-4 sm:px-6 py-4 hover:bg-gray-50"
                >
                  {/* Cover thumb */}
                  <div className="w-16 h-16 shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                    {post.cover_image ? (
                      <img
                        src={post.cover_image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                        No image
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="font-medium text-gray-900 truncate">
                        {post.title || 'Untitled'}
                      </p>
                      <span
                        className={`px-2 py-0.5 text-xs rounded-full font-medium capitalize ${REVIEW_BADGE_STYLE[rs]}`}
                      >
                        {REVIEW_LABEL[rs]}
                      </span>
                      {rs === 'pending_review' && (
                        <Clock className="w-3.5 h-3.5 text-blue-500" />
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
                      {post.category && <span>{post.category}</span>}
                      <span>/{post.slug}</span>
                    </div>
                    {rs === 'rejected' && post.rejection_reason && (
                      <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-800">
                        <span className="font-semibold">Admin note:</span>{' '}
                        <span className="whitespace-pre-wrap">
                          {post.rejection_reason}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    {post.status === 'published' && (
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="p-2 text-gray-500 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
                        title="View on site"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    )}
                    <Link
                      href={`/author/posts/${post.id}`}
                      className={`p-2 rounded-lg transition-colors ${
                        rs === 'rejected'
                          ? 'text-red-600 hover:bg-red-50'
                          : 'text-gray-500 hover:text-black hover:bg-gray-100'
                      }`}
                      title={canEdit ? 'Edit' : 'View'}
                    >
                      {canEdit ? (
                        <Edit className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Link>
                    {canDelete && (
                      <button
                        onClick={() => setDeleteId(post.id)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Post?</h3>
            <p className="text-gray-600 mb-6">
              This action cannot be undone. The post will be permanently deleted.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteId(null)}
                disabled={isDeleting}
                className="px-4 py-2 border-2 border-gray-200 text-gray-700 rounded-lg font-medium hover:border-gray-300 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
