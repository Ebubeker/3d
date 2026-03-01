'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { uploadMedia, getMediaType } from '@/lib/supabase/storage';
import { TeamMember, PortfolioItem, getMediaUrls, isLinkEntry, parseLinkEntry } from '@/lib/supabase/types';
import { ArrowLeft, Plus, Edit, Trash2, X, Image as ImageIcon, Upload, Loader2, FolderOpen, Images, Video, FileText, Link2, ExternalLink } from 'lucide-react';
import PdfThumbnail from '@/app/components/PdfThumbnail';
import LinkThumbnail from '@/app/components/LinkThumbnail';

type DisplayType = 'project' | 'gallery';

export default function PortfolioManagementPage() {
  const params = useParams();
  const memberId = params.id as string;

  const [member, setMember] = useState<TeamMember | null>(null);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<DisplayType>('project');
  const [modalType, setModalType] = useState<DisplayType>('project');
  const [showLinkForm, setShowLinkForm] = useState(false);
  const [linkData, setLinkData] = useState({ url: '', label: '', type: 'link' as 'link' | 'image' | 'video' });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    media_urls: [] as string[],
    category: '',
  });

  // Filter items based on active tab
  const filteredItems = portfolioItems.filter(item => item.display_type === activeTab);

  useEffect(() => {
    fetchData();
  }, [memberId]);

  const fetchData = async () => {
    const supabase = createClient();

    const [memberResult, portfolioResult] = await Promise.all([
      supabase.from('team_members').select('*').eq('id', memberId).single(),
      supabase.from('portfolio_items').select('*').eq('team_member_id', memberId).order('created_at', { ascending: false }),
    ]);

    if (memberResult.data) {
      setMember(memberResult.data);
    }
    setPortfolioItems(portfolioResult.data || []);
    setIsLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadError('');

    const uploadedUrls: string[] = [];

    for (const file of Array.from(files)) {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      const isPdf = file.type === 'application/pdf';

      if (!isImage && !isVideo && !isPdf) {
        setUploadError('Please upload image, video, or PDF files only');
        continue;
      }

      // Different size limits
      const maxSize = isVideo ? 100 * 1024 * 1024 : isPdf ? 20 * 1024 * 1024 : 5 * 1024 * 1024;
      const maxSizeLabel = isVideo ? '100MB' : isPdf ? '20MB' : '5MB';

      if (file.size > maxSize) {
        setUploadError(`${file.name} exceeds ${maxSizeLabel} limit`);
        continue;
      }

      const result = await uploadMedia(file, 'portfolio');

      if (result) {
        uploadedUrls.push(result.url);
      } else {
        setUploadError(`Failed to upload ${file.name}`);
      }
    }

    if (uploadedUrls.length > 0) {
      setFormData((prev) => ({
        ...prev,
        media_urls: [...prev.media_urls, ...uploadedUrls]
      }));
    }

    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openAddModal = (type: DisplayType) => {
    setFormData({ title: '', description: '', media_urls: [], category: '' });
    setEditingItem(null);
    setModalType(type);
    setUploadError('');
    setShowLinkForm(false);
    setLinkData({ url: '', label: '', type: 'link' });
    setShowModal(true);
  };

  const openEditModal = (item: PortfolioItem) => {
    setFormData({
      title: item.title,
      description: item.description || '',
      media_urls: getMediaUrls(item),
      category: item.category || '',
    });
    setEditingItem(item);
    setModalType(item.display_type);
    setUploadError('');
    setShowLinkForm(false);
    setLinkData({ url: '', label: '', type: 'link' });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate gallery requires at least one file
    if (modalType === 'gallery' && formData.media_urls.length === 0) {
      setUploadError('Please upload at least one file');
      return;
    }

    setIsSaving(true);

    const supabase = createClient();

    // Store media URLs as JSON string (or single URL for backwards compatibility if only one)
    const imageUrlValue = formData.media_urls.length === 1
      ? formData.media_urls[0]
      : formData.media_urls.length > 1
        ? JSON.stringify(formData.media_urls)
        : null;

    // Prepare data based on modal type
    const submitData = modalType === 'gallery'
      ? {
          title: formData.title || 'Gallery Image',
          image_url: imageUrlValue,
          display_type: 'gallery' as const
        }
      : {
          title: formData.title,
          description: formData.description || null,
          category: formData.category || null,
          image_url: imageUrlValue,
          display_type: 'project' as const
        };

    if (editingItem) {
      const { error } = await supabase
        .from('portfolio_items')
        .update(submitData)
        .eq('id', editingItem.id);

      if (!error) {
        setPortfolioItems(portfolioItems.map((item) =>
          item.id === editingItem.id ? { ...item, ...submitData } : item
        ));
      }
    } else {
      const { data, error } = await supabase
        .from('portfolio_items')
        .insert([{ ...submitData, team_member_id: memberId }])
        .select()
        .single();

      if (!error && data) {
        setPortfolioItems([data, ...portfolioItems]);
      }
    }

    setShowModal(false);
    setIsSaving(false);
  };

  const handleDelete = async (id: string) => {
    const supabase = createClient();
    const { error } = await supabase
      .from('portfolio_items')
      .delete()
      .eq('id', id);

    if (!error) {
      setPortfolioItems(portfolioItems.filter((item) => item.id !== id));
    }
    setDeleteId(null);
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading portfolio...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/dashboard/team"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-black mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Team
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Portfolio</h1>
            <p className="text-gray-600 mt-1">
              {member?.name ? `Manage ${member.name}'s portfolio items` : 'Manage portfolio items'}
            </p>
          </div>
          <button
            onClick={() => openAddModal(activeTab)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            {activeTab === 'project' ? 'Add Project' : 'Add Gallery Image'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('project')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'project'
              ? 'bg-black text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <FolderOpen className="w-4 h-4" />
          Projects
          <span className={`ml-1 px-2 py-0.5 text-xs rounded-full ${
            activeTab === 'project' ? 'bg-white/20' : 'bg-gray-200'
          }`}>
            {portfolioItems.filter(i => i.display_type === 'project').length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('gallery')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'gallery'
              ? 'bg-black text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Images className="w-4 h-4" />
          Gallery Images
          <span className={`ml-1 px-2 py-0.5 text-xs rounded-full ${
            activeTab === 'gallery' ? 'bg-white/20' : 'bg-gray-200'
          }`}>
            {portfolioItems.filter(i => i.display_type === 'gallery').length}
          </span>
        </button>
      </div>

      {/* Portfolio Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          {activeTab === 'project' ? (
            <FolderOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          ) : (
            <Images className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          )}
          <p className="text-gray-600 mb-4">
            {activeTab === 'project' ? 'No projects yet.' : 'No gallery images yet.'}
          </p>
          <button
            onClick={() => openAddModal(activeTab)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            {activeTab === 'project' ? 'Add First Project' : 'Add First Gallery Image'}
          </button>
        </div>
      ) : (
        <div className={`grid gap-4 sm:gap-6 ${
          activeTab === 'gallery'
            ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
            : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
        }`}>
          {filteredItems.map((item) => {
            const mediaUrls = getMediaUrls(item);
            const firstUrl = mediaUrls[0];
            const firstMediaType = firstUrl ? getMediaType(firstUrl) : null;
            const fileCount = mediaUrls.length;

            return (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className={`bg-gray-100 relative ${activeTab === 'gallery' ? 'aspect-square' : 'aspect-video'}`}>
                {firstUrl ? (
                  isLinkEntry(firstUrl) ? (
                    <LinkThumbnail entry={parseLinkEntry(firstUrl)!} />
                  ) : firstMediaType === 'video' ? (
                    <video
                      src={firstUrl}
                      className="w-full h-full object-cover"
                      preload="metadata"
                      playsInline
                      muted
                    />
                  ) : firstMediaType === 'pdf' ? (
                    <PdfThumbnail url={firstUrl} />
                  ) : (
                    <img
                      src={firstUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  )
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-gray-300" />
                  </div>
                )}
                {firstMediaType === 'video' && (
                  <span className="absolute top-2 left-2 px-2 py-1 bg-black/70 text-white text-xs rounded flex items-center gap-1">
                    <Video className="w-3 h-3" />
                    Video
                  </span>
                )}
                {fileCount > 1 && (
                  <span className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 text-white text-xs rounded flex items-center gap-1">
                    <Images className="w-3 h-3" />
                    {fileCount} files
                  </span>
                )}
                {activeTab === 'project' && item.category && (
                  <span className="absolute top-2 right-2 px-2 py-1 bg-black text-white text-xs rounded">
                    {item.category}
                  </span>
                )}
              </div>
              {activeTab === 'project' ? (
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                  {item.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                  )}
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => openEditModal(item)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteId(item.id)}
                      className="px-3 py-2 border border-gray-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-2 flex gap-1">
                  <button
                    onClick={() => openEditModal(item)}
                    className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-xs"
                  >
                    <Edit className="w-3 h-3" />
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteId(item.id)}
                    className="px-2 py-1.5 border border-gray-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          );
          })}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                {modalType === 'gallery'
                  ? editingItem ? 'Edit Gallery Image' : 'Add Gallery Image'
                  : editingItem ? 'Edit Project' : 'Add Project'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title - only required for projects */}
              {modalType === 'project' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors text-black"
                    placeholder="Project title"
                    required
                  />
                </div>
              )}

              {/* Category - only for projects */}
              {modalType === 'project' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors text-black"
                    placeholder="e.g., Sportswear, Outerwear"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Files {modalType === 'gallery' && '*'}
                  {formData.media_urls.length > 0 && (
                    <span className="text-gray-500 font-normal ml-2">({formData.media_urls.length} file{formData.media_urls.length > 1 ? 's' : ''})</span>
                  )}
                </label>

                {/* Media Preview Grid */}
                {formData.media_urls.length > 0 && (
                  <div className="mb-4 grid grid-cols-3 gap-2">
                    {formData.media_urls.map((url, index) => {
                      const linkEntry = isLinkEntry(url) ? parseLinkEntry(url) : null;
                      const mediaType = linkEntry ? 'link-entry' : getMediaType(url);
                      return (
                        <div key={index} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                          {linkEntry ? (
                            <LinkThumbnail entry={linkEntry} />
                          ) : mediaType === 'video' ? (
                            <video
                              src={url}
                              className="w-full h-full object-cover"
                              preload="metadata"
                              muted
                            />
                          ) : mediaType === 'pdf' ? (
                            <PdfThumbnail url={url} />
                          ) : (
                            <Image
                              src={url}
                              alt={`File ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          )}
                          {mediaType === 'video' && (
                            <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/70 text-white text-[10px] rounded flex items-center gap-0.5">
                              <Video className="w-2.5 h-2.5" />
                            </span>
                          )}
                          {linkEntry && (
                            <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/70 text-white text-[10px] rounded flex items-center gap-0.5">
                              <Link2 className="w-2.5 h-2.5" />
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => setFormData((prev) => ({
                              ...prev,
                              media_urls: prev.media_urls.filter((_, i) => i !== index)
                            }))}
                            className="absolute -top-1 -right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 z-10"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Upload Button */}
                <div className="flex gap-3">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*,video/*,.pdf"
                    multiple
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors text-gray-600 disabled:opacity-50"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5" />
                        {formData.media_urls.length > 0 ? 'Add more files' : 'Upload files'}
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Images: max 5MB | Videos: max 100MB | PDFs: max 20MB
                </p>

                {/* Or Add Link */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowLinkForm(!showLinkForm)}
                    className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black transition-colors"
                  >
                    <Link2 className="w-4 h-4" />
                    {showLinkForm ? 'Hide link form' : 'Or add a link'}
                  </button>

                  {showLinkForm && (
                    <div className="mt-3 space-y-3 p-3 bg-gray-50 rounded-lg">
                      <input
                        type="url"
                        value={linkData.url}
                        onChange={(e) => setLinkData(prev => ({ ...prev, url: e.target.value }))}
                        placeholder="https://example.com/..."
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors text-sm text-black"
                      />
                      <input
                        type="text"
                        value={linkData.label}
                        onChange={(e) => setLinkData(prev => ({ ...prev, label: e.target.value }))}
                        placeholder="Display name"
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors text-sm text-black"
                      />
                      <div className="flex gap-2">
                        {(['link', 'video'] as const).map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setLinkData(prev => ({ ...prev, type: t }))}
                            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                              linkData.type === t
                                ? 'bg-black text-white'
                                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            {t === 'link' && <ExternalLink className="w-3 h-3" />}
                            {t === 'video' && <Video className="w-3 h-3" />}
                            {t.charAt(0).toUpperCase() + t.slice(1)}
                          </button>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (!linkData.url || !linkData.label) return;
                          const entry = JSON.stringify({ link: linkData.url, label: linkData.label, type: linkData.type });
                          setFormData(prev => ({ ...prev, media_urls: [...prev.media_urls, entry] }));
                          setLinkData({ url: '', label: '', type: 'link' });
                        }}
                        disabled={!linkData.url || !linkData.label}
                        className="w-full px-3 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Add Link
                      </button>
                    </div>
                  )}
                </div>

                {/* Upload Error */}
                {uploadError && (
                  <p className="text-red-600 text-sm mt-2">{uploadError}</p>
                )}
              </div>

              {/* Description - only for projects */}
              {modalType === 'project' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors resize-none text-black"
                    placeholder="Describe the project..."
                  />
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 border-2 border-gray-200 text-gray-700 rounded-lg font-medium hover:border-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 px-4 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving
                    ? 'Saving...'
                    : editingItem
                      ? 'Save Changes'
                      : modalType === 'gallery'
                        ? 'Add Image'
                        : 'Add Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Project?</h3>
            <p className="text-gray-600 mb-6">
              This action cannot be undone. This will permanently delete this portfolio item.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 border-2 border-gray-200 text-gray-700 rounded-lg font-medium hover:border-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
