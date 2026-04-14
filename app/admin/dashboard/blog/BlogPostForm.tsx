'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import TipTapEditor from '@/app/components/TipTapEditor';
import { createClient } from '@/lib/supabase/client';
import { BlogPost } from '@/lib/supabase/types';
import { BLOG_CATEGORIES } from '@/lib/blog/categories';
import { generateSlug, ensureUniqueSlug } from '@/lib/blog/slug';
import { calculateReadingTime } from '@/lib/blog/reading-time';
import {
  ArrowLeft,
  Upload,
  Loader2,
  X,
  Plus,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface BlogPostFormProps {
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

export default function BlogPostForm({ mode, initialPost }: BlogPostFormProps) {
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

    const setUploading = field === 'cover_image' ? setIsUploadingCover : setIsUploadingOg;
    setUploading(true);
    setError('');

    try {
      const body = new FormData();
      body.append('file', file);
      body.append('folder', 'blog');

      const res = await fetch('/api/upload', { method: 'POST', body });
      const data = await res.json();

      if (data?.url) {
        setFormData((prev) => ({ ...prev, [field]: data.url }));
      } else {
        setError(data?.error || 'Upload failed');
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

  const handleSubmit = async (publishStatus: 'draft' | 'published') => {
    setError('');

    // Validation
    if (!formData.title.trim()) return setError('Title is required');
    if (!formData.slug.trim()) return setError('Slug is required');
    if (!formData.content.trim() || formData.content === '<p></p>')
      return setError('Content is required');

    setIsSaving(true);

    try {
      const supabase = createClient();

      // Ensure slug uniqueness
      const cleanedSlug = generateSlug(formData.slug) || generateSlug(formData.title);
      const uniqueSlug = await ensureUniqueSlug(
        cleanedSlug,
        mode === 'edit' ? initialPost?.id : undefined
      );

      const readingTime = calculateReadingTime(formData.content);

      const now = new Date().toISOString();
      const wasPublishedBefore = initialPost?.status === 'published';
      const publishedAt =
        publishStatus === 'published'
          ? wasPublishedBefore && initialPost?.published_at
            ? initialPost.published_at
            : now
          : null;

      const payload = {
        title: formData.title.trim(),
        slug: uniqueSlug,
        excerpt: formData.excerpt.trim() || null,
        content: formData.content,
        cover_image: formData.cover_image || null,
        category: formData.category.trim() || null,
        tags: formData.tags,
        status: publishStatus,
        published_at: publishedAt,
        reading_time_minutes: readingTime,
        meta_title: formData.meta_title.trim() || null,
        meta_description: formData.meta_description.trim() || null,
        og_image: formData.og_image || null,
      };

      if (mode === 'edit' && initialPost) {
        const { error: updateError } = await supabase
          .from('blog_posts')
          .update(payload)
          .eq('id', initialPost.id);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('blog_posts')
          .insert([payload]);
        if (insertError) throw insertError;
      }

      router.push('/admin/dashboard/blog');
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save post';
      setError(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/dashboard/blog"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-black mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to posts
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          {mode === 'create' ? 'New Blog Post' : 'Edit Blog Post'}
        </h1>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit('published');
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
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none text-black text-lg"
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
              className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none text-black"
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
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, cover_image: '' }))}
                className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-700 hover:text-red-600 shadow-md"
                aria-label="Remove cover"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => coverInputRef.current?.click()}
              disabled={isUploadingCover}
              className="w-full aspect-[16/9] border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:border-black hover:text-black transition-colors"
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
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none text-black resize-none"
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
                    setFormData((prev) => ({ ...prev, category: e.target.value }))
                  }
                  placeholder="Custom category"
                  className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none text-black"
                />
                <button
                  type="button"
                  onClick={() => {
                    setUseCustomCategory(false);
                    setFormData((prev) => ({ ...prev, category: '' }));
                  }}
                  className="px-3 py-2 border-2 border-gray-200 rounded-lg text-sm text-gray-700 hover:border-black"
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
                    setFormData((prev) => ({ ...prev, category: e.target.value }));
                  }
                }}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none text-black"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
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
                className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none text-black"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800"
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
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-red-600"
                      aria-label={`Remove ${tag}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
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
          <TipTapEditor
            value={formData.content}
            onChange={(html) => setFormData((prev) => ({ ...prev, content: html }))}
          />
        </div>

        {/* SEO (collapsible) */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <button
            type="button"
            onClick={() => setSeoOpen(!seoOpen)}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
          >
            <span className="font-medium text-gray-900">SEO settings (optional)</span>
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
                    setFormData((prev) => ({ ...prev, meta_title: e.target.value }))
                  }
                  placeholder="Defaults to post title"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none text-black"
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
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none text-black resize-none"
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
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, og_image: '' }))
                      }
                      className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full text-gray-700 hover:text-red-600 shadow"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => ogInputRef.current?.click()}
                    disabled={isUploadingOg}
                    className="px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-black hover:text-black flex items-center gap-2"
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
        <div className="flex flex-col sm:flex-row gap-3 justify-end sticky bottom-4 bg-gray-100/70 backdrop-blur-sm p-4 rounded-xl border border-gray-200">
          <Link
            href="/admin/dashboard/blog"
            className="px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-lg font-medium text-center hover:border-gray-300"
          >
            Cancel
          </Link>
          <button
            type="button"
            onClick={() => handleSubmit('draft')}
            disabled={isSaving}
            className="px-6 py-3 border-2 border-gray-900 text-gray-900 rounded-lg font-medium hover:bg-gray-900 hover:text-white disabled:opacity-50 transition-colors"
          >
            {isSaving ? 'Saving...' : 'Save as Draft'}
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors"
          >
            {isSaving ? 'Publishing...' : mode === 'edit' && initialPost?.status === 'published' ? 'Update' : 'Publish'}
          </button>
        </div>
      </form>
    </div>
  );
}
