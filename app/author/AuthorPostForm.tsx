'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import TipTapEditor from '@/app/components/TipTapEditor';
import { uploadMedia } from '@/lib/supabase/storage';
import { BlogPost } from '@/lib/supabase/types';
import { BLOG_CATEGORIES } from '@/lib/blog/categories';
import { generateSlug } from '@/lib/blog/slug';
import {
  ArrowLeft,
  Upload,
  Loader2,
  X,
  Plus,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Clock,
  CheckCircle2,
  Send,
} from 'lucide-react';

interface AuthorPostFormProps {
  mode: 'create' | 'edit';
  initialPost?: BlogPost;
}

interface FormState {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  category: string;
  tags: string[];
  meta_title: string;
  meta_description: string;
  og_image: string;
}

const emptyState: FormState = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  cover_image: '',
  category: '',
  tags: [],
  meta_title: '',
  meta_description: '',
  og_image: '',
};

export default function AuthorPostForm({ mode, initialPost }: AuthorPostFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<FormState>(
    initialPost
      ? {
          title: initialPost.title,
          slug: initialPost.slug,
          excerpt: initialPost.excerpt || '',
          content: initialPost.content,
          cover_image: initialPost.cover_image || '',
          category: initialPost.category || '',
          tags: initialPost.tags || [],
          meta_title: initialPost.meta_title || '',
          meta_description: initialPost.meta_description || '',
          og_image: initialPost.og_image || '',
        }
      : emptyState
  );

  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isUploadingOg, setIsUploadingOg] = useState(false);
  const [error, setError] = useState('');
  const [slugEdited, setSlugEdited] = useState(mode === 'edit');
  const [seoOpen, setSeoOpen] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [useCustomCategory, setUseCustomCategory] = useState(() => {
    if (!initialPost?.category) return false;
    return !BLOG_CATEGORIES.includes(initialPost.category as never);
  });

  const coverInputRef = useRef<HTMLInputElement>(null);
  const ogInputRef = useRef<HTMLInputElement>(null);

  const reviewStatus = initialPost?.review_status || 'draft';
  // Once submitted for review or published, the author can no longer edit.
  // The admin has to either reject it (back to 'rejected') or move it to
  // draft before edits become possible again.
  const isReadOnly =
    mode === 'edit' &&
    (reviewStatus === 'pending_review' || reviewStatus === 'published');

  // Auto-generate slug from title when creating and slug wasn't manually edited
  useEffect(() => {
    if (mode === 'create' && !slugEdited && formData.title) {
      setFormData((prev) => ({ ...prev, slug: generateSlug(prev.title) }));
    }
  }, [formData.title, mode, slugEdited]);

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'cover_image' | 'og_image'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setError('Image must be less than 50MB');
      return;
    }

    const setUploading =
      field === 'cover_image' ? setIsUploadingCover : setIsUploadingOg;
    setUploading(true);
    setError('');

    try {
      const result = await uploadMedia(file, 'blog');
      if (result?.url) {
        setFormData((prev) => ({ ...prev, [field]: result.url }));
      } else {
        setError('Upload failed');
      }
    } catch {
      setError('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const addTag = () => {
    const trimmed = newTag.trim();
    if (!trimmed || formData.tags.includes(trimmed)) return;
    setFormData((prev) => ({ ...prev, tags: [...prev.tags, trimmed] }));
    setNewTag('');
  };

  const removeTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleSubmit = async (submit: boolean) => {
    setError('');

    // Validation (mirrors validateAuthorPostPayload on the server)
    if (!formData.title.trim()) return setError('Title is required');
    if (!formData.content.trim() || formData.content === '<p></p>')
      return setError('Content is required');

    setIsSaving(true);

    const payload = {
      title: formData.title.trim(),
      slug: formData.slug.trim() || undefined,
      excerpt: formData.excerpt.trim() || null,
      content: formData.content,
      cover_image: formData.cover_image || null,
      category: formData.category.trim() || null,
      tags: formData.tags,
      meta_title: formData.meta_title.trim() || null,
      meta_description: formData.meta_description.trim() || null,
      og_image: formData.og_image || null,
      submit,
    };

    try {
      const url =
        mode === 'edit' && initialPost
          ? `/api/author/posts/${initialPost.id}`
          : '/api/author/posts';
      const method = mode === 'edit' ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(json.error || 'Failed to save post');
      }

      router.push('/author/dashboard');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save post');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/author/dashboard"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-black mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to my posts
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          {mode === 'create'
            ? 'New Post'
            : isReadOnly
              ? 'View Post'
              : 'Edit Post'}
        </h1>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Status banners */}
      {mode === 'edit' && reviewStatus === 'pending_review' && (
        <div className="mb-6 p-5 bg-blue-50 border-2 border-blue-200 rounded-xl flex items-start gap-3">
          <Clock className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-blue-900">Pending Admin Review</p>
            <p className="text-sm text-blue-800 mt-1">
              This post is locked while an admin reviews it. You&apos;ll be able
              to edit it again if they reject it with changes.
            </p>
          </div>
        </div>
      )}

      {mode === 'edit' && reviewStatus === 'published' && (
        <div className="mb-6 p-5 bg-green-50 border-2 border-green-200 rounded-xl flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-green-900">Published</p>
            <p className="text-sm text-green-800 mt-1">
              This post is live on the blog. If you need to make changes, ask
              an admin to move it back to draft.
            </p>
          </div>
        </div>
      )}

      {mode === 'edit' &&
        reviewStatus === 'rejected' &&
        initialPost?.rejection_reason && (
          <div className="mb-6 p-5 bg-red-50 border-2 border-red-200 rounded-xl">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-red-900">
                  Admin requested changes
                </p>
                <p className="text-sm text-red-800 mt-1 whitespace-pre-wrap">
                  {initialPost.rejection_reason}
                </p>
                <p className="text-xs text-red-700 mt-2">
                  Revise your post and click <strong>Submit for Review</strong>{' '}
                  when you&apos;re ready. Saving as draft keeps the note
                  visible.
                </p>
              </div>
            </div>
          </div>
        )}

      <fieldset disabled={isReadOnly} className="group">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (isReadOnly) return;
            handleSubmit(true);
          }}
          className="space-y-6"
        >
          {/* Title */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Your post title..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none text-black text-lg disabled:bg-gray-50 disabled:cursor-not-allowed"
              required
            />

            <label className="block text-sm font-medium text-gray-700 mt-4 mb-2">
              Slug <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">/blog/</span>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, slug: e.target.value }));
                  setSlugEdited(true);
                }}
                placeholder="url-friendly-slug"
                className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none text-black disabled:bg-gray-50 disabled:cursor-not-allowed"
                required
              />
            </div>
          </div>

          {/* Cover image */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cover image
            </label>
            {formData.cover_image ? (
              <div className="relative">
                <img
                  src={formData.cover_image}
                  alt="Cover"
                  className="w-full max-h-72 object-cover rounded-lg"
                />
                {!isReadOnly && (
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, cover_image: '' }))
                    }
                    className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-700 hover:text-red-600 shadow-md"
                    aria-label="Remove cover"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => coverInputRef.current?.click()}
                disabled={isUploadingCover || isReadOnly}
                className="w-full aspect-[16/9] border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:border-black hover:text-black transition-colors disabled:cursor-not-allowed"
              >
                {isUploadingCover ? (
                  <Loader2 className="w-8 h-8 animate-spin" />
                ) : (
                  <>
                    <Upload className="w-8 h-8 mb-2" />
                    <span className="text-sm">Click to upload cover image</span>
                  </>
                )}
              </button>
            )}
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload(e, 'cover_image')}
              className="hidden"
            />
          </div>

          {/* Excerpt */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Excerpt
            </label>
            <textarea
              value={formData.excerpt}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, excerpt: e.target.value }))
              }
              placeholder="Short preview shown on the blog list and in search results..."
              rows={3}
              maxLength={280}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none text-black resize-none disabled:bg-gray-50 disabled:cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.excerpt.length} / 280 characters
            </p>
          </div>

          {/* Category + Tags */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              {useCustomCategory ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                    placeholder="Custom category"
                    className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none text-black disabled:bg-gray-50 disabled:cursor-not-allowed"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setUseCustomCategory(false);
                      setFormData((prev) => ({ ...prev, category: '' }));
                    }}
                    className="px-3 py-2 border-2 border-gray-200 rounded-lg text-sm text-gray-700 hover:border-black disabled:cursor-not-allowed"
                  >
                    Use preset
                  </button>
                </div>
              ) : (
                <select
                  value={formData.category}
                  onChange={(e) => {
                    if (e.target.value === '__custom__') {
                      setUseCustomCategory(true);
                      setFormData((prev) => ({ ...prev, category: '' }));
                    } else {
                      setFormData((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }));
                    }
                  }}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none text-black disabled:bg-gray-50 disabled:cursor-not-allowed"
                >
                  <option value="">Select category</option>
                  {BLOG_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                  <option value="__custom__">+ Custom...</option>
                </select>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  placeholder="Add a tag and press Enter"
                  className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none text-black disabled:bg-gray-50 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                    >
                      {tag}
                      {!isReadOnly && (
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="hover:text-red-600"
                          aria-label={`Remove ${tag}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content <span className="text-red-500">*</span>
            </label>
            {isReadOnly ? (
              <div
                className="prose prose-sm max-w-none text-gray-800 border-2 border-gray-100 rounded-lg p-4"
                dangerouslySetInnerHTML={{ __html: formData.content }}
              />
            ) : (
              <TipTapEditor
                value={formData.content}
                onChange={(html) =>
                  setFormData((prev) => ({ ...prev, content: html }))
                }
              />
            )}
          </div>

          {/* SEO (collapsible) */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <button
              type="button"
              onClick={() => setSeoOpen(!seoOpen)}
              className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
            >
              <span className="font-medium text-gray-900">
                SEO settings (optional)
              </span>
              {seoOpen ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            {seoOpen && (
              <div className="px-6 pb-6 space-y-4 border-t border-gray-200 pt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta title
                  </label>
                  <input
                    type="text"
                    value={formData.meta_title}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        meta_title: e.target.value,
                      }))
                    }
                    placeholder="Defaults to post title"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none text-black disabled:bg-gray-50 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta description
                  </label>
                  <textarea
                    value={formData.meta_description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        meta_description: e.target.value,
                      }))
                    }
                    placeholder="Defaults to excerpt. ~155 characters recommended."
                    rows={2}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none text-black resize-none disabled:bg-gray-50 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    OG image override
                  </label>
                  {formData.og_image ? (
                    <div className="relative inline-block">
                      <img
                        src={formData.og_image}
                        alt="OG"
                        className="max-h-40 rounded-lg"
                      />
                      {!isReadOnly && (
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({ ...prev, og_image: '' }))
                          }
                          className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full text-gray-700 hover:text-red-600 shadow"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => ogInputRef.current?.click()}
                      disabled={isUploadingOg || isReadOnly}
                      className="px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-black hover:text-black flex items-center gap-2 disabled:cursor-not-allowed"
                    >
                      {isUploadingOg ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4" />
                      )}
                      Upload OG image (defaults to cover)
                    </button>
                  )}
                  <input
                    ref={ogInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'og_image')}
                    className="hidden"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          {!isReadOnly && (
            <div className="flex flex-col sm:flex-row gap-3 justify-end sticky bottom-4 bg-gray-100/70 backdrop-blur-sm p-4 rounded-xl border border-gray-200">
              <Link
                href="/author/dashboard"
                className="px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-lg font-medium text-center hover:border-gray-300"
              >
                Cancel
              </Link>
              <button
                type="button"
                onClick={() => handleSubmit(false)}
                disabled={isSaving}
                className="px-6 py-3 border-2 border-gray-900 text-gray-900 rounded-lg font-medium hover:bg-gray-900 hover:text-white disabled:opacity-50 transition-colors"
              >
                {isSaving ? 'Saving...' : 'Save as Draft'}
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                {isSaving ? 'Submitting...' : 'Submit for Review'}
              </button>
            </div>
          )}
        </form>
      </fieldset>
    </div>
  );
}
