'use client';

import { useEffect, useRef, useState } from 'react';
import {
  FolderLock,
  Loader2,
  Upload,
  Download,
  Trash2,
  FileText,
  FileSpreadsheet,
  Image as ImageIcon,
  File,
} from 'lucide-react';
import type {
  TeamMemberFile,
  TeamMemberFileCategory,
} from '@/lib/supabase/types';

interface Props {
  teamMemberId: string;
}

const CATEGORIES: { value: TeamMemberFileCategory; label: string }[] = [
  { value: 'contract', label: 'Contract' },
  { value: 'invoice', label: 'Invoice' },
  { value: 'tax', label: 'Tax' },
  { value: 'payment', label: 'Payment' },
  { value: 'other', label: 'Other' },
];

const CATEGORY_STYLES: Record<TeamMemberFileCategory, string> = {
  contract: 'bg-blue-100 text-blue-800',
  invoice: 'bg-green-100 text-green-800',
  tax: 'bg-amber-100 text-amber-800',
  payment: 'bg-purple-100 text-purple-800',
  other: 'bg-gray-100 text-gray-700',
};

const ACCEPT_ATTR = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/csv',
  'text/plain',
].join(',');

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function iconFor(mime: string) {
  if (mime.startsWith('image/')) return ImageIcon;
  if (mime === 'application/pdf') return FileText;
  if (
    mime === 'application/vnd.ms-excel' ||
    mime === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    mime === 'text/csv'
  )
    return FileSpreadsheet;
  if (
    mime === 'application/msword' ||
    mime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    mime === 'text/plain'
  )
    return FileText;
  return File;
}

export default function FilesPanel({ teamMemberId }: Props) {
  const [files, setFiles] = useState<TeamMemberFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const [selectedFile, setSelectedFile] = useState<globalThis.File | null>(null);
  const [label, setLabel] = useState('');
  const [category, setCategory] = useState<TeamMemberFileCategory>('other');
  const [notes, setNotes] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchFiles = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch(
        `/api/admin/team-files?teamMemberId=${encodeURIComponent(teamMemberId)}`
      );
      const body = await res.json();
      if (!res.ok) {
        setError(body.error || 'Failed to load files');
      } else {
        setFiles(body.files || []);
      }
    } catch {
      setError('Network error loading files');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamMemberId]);

  const resetForm = () => {
    setSelectedFile(null);
    setLabel('');
    setCategory('other');
    setNotes('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Pick a file to upload');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('teamMemberId', teamMemberId);
      formData.append('category', category);
      if (label.trim()) formData.append('label', label.trim());
      if (notes.trim()) formData.append('notes', notes.trim());

      const res = await fetch('/api/admin/team-files', {
        method: 'POST',
        body: formData,
      });

      let body: { error?: string; file?: TeamMemberFile } = {};
      try {
        body = await res.json();
      } catch {
        setError(
          `Server returned ${res.status} ${res.statusText || 'error'} with no JSON body. Check the server logs.`
        );
        return;
      }

      if (!res.ok) {
        setError(body.error || 'Failed to upload file');
        return;
      }

      if (body.file) {
        setFiles((prev) => [body.file as TeamMemberFile, ...prev]);
        resetForm();
      }
    } catch (err) {
      setError(
        err instanceof Error ? `Network error: ${err.message}` : 'Upload failed'
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = async (id: string) => {
    setError('');
    try {
      const res = await fetch(`/api/admin/team-files/${id}`);
      const body = await res.json();
      if (!res.ok || !body.url) {
        setError(body.error || 'Failed to get download link');
        return;
      }
      // Open in a new tab — Supabase signs the URL with Content-Disposition
      // download=<file_name> so the browser downloads it directly.
      window.open(body.url, '_blank', 'noopener,noreferrer');
    } catch {
      setError('Network error requesting download');
    }
  };

  const handleDelete = async (file: TeamMemberFile) => {
    if (
      !confirm(
        `Delete "${file.file_name}"? This will permanently remove the file and its metadata.`
      )
    ) {
      return;
    }

    setDeletingId(file.id);
    setError('');
    try {
      const res = await fetch(`/api/admin/team-files/${file.id}`, {
        method: 'DELETE',
      });
      const body = await res.json();
      if (!res.ok) {
        setError(body.error || 'Failed to delete file');
        return;
      }
      setFiles((prev) => prev.filter((f) => f.id !== file.id));
    } catch {
      setError('Network error deleting file');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
      <div className="flex items-center justify-between border-b border-gray-200 pb-2">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <FolderLock className="w-5 h-5" />
          Private Files
        </h2>
        <span className="text-xs text-gray-500">
          {files.length} {files.length === 1 ? 'file' : 'files'}
        </span>
      </div>

      <p className="text-sm text-gray-600">
        Admin-only document storage for this team member. Files live in a
        private bucket — they are never exposed on the public site or the
        author portal. Use this for contracts, invoices, tax forms, payment
        records, and other financial documents.
      </p>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Upload form */}
      <form
        onSubmit={handleUpload}
        className="space-y-3 border border-gray-200 rounded-lg p-4 bg-gray-50"
      >
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
            File
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPT_ATTR}
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-700 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-black file:text-white hover:file:bg-gray-800"
          />
          {selectedFile && (
            <p className="mt-2 text-xs text-gray-500">
              {selectedFile.name} ({formatBytes(selectedFile.size)})
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            PDF, images, Word, Excel, CSV, TXT. Max 25 MB per file.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value as TeamMemberFileCategory)
              }
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Label (optional)
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g., Q1 2026 invoice"
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
            Notes (optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="Any context for this document..."
            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 resize-none"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isUploading || !selectedFile}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg font-medium text-sm hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            Upload
          </button>
        </div>
      </form>

      {/* File list */}
      {isLoading ? (
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading files...
        </div>
      ) : files.length === 0 ? (
        <p className="text-sm text-gray-500 italic">
          No files uploaded yet.
        </p>
      ) : (
        <ul className="divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden">
          {files.map((f) => {
            const Icon = iconFor(f.mime_type);
            const isDeleting = deletingId === f.id;
            return (
              <li
                key={f.id}
                className="flex items-start gap-3 p-3 sm:p-4 hover:bg-gray-50"
              >
                <div className="shrink-0 w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-gray-900 text-sm truncate max-w-full">
                      {f.label || f.file_name}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${CATEGORY_STYLES[f.category]}`}
                    >
                      {f.category}
                    </span>
                  </div>
                  {f.label && (
                    <div className="text-xs text-gray-500 truncate">
                      {f.file_name}
                    </div>
                  )}
                  <div className="text-xs text-gray-500 mt-1">
                    {formatBytes(f.file_size)} •{' '}
                    {new Date(f.created_at).toLocaleDateString()}{' '}
                    {new Date(f.created_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                  {f.notes && (
                    <p className="text-xs text-gray-600 mt-1 whitespace-pre-wrap">
                      {f.notes}
                    </p>
                  )}
                </div>
                <div className="shrink-0 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleDownload(f.id)}
                    className="p-2 text-gray-500 hover:text-black rounded"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(f)}
                    disabled={isDeleting}
                    className="p-2 text-gray-500 hover:text-red-600 rounded disabled:opacity-50"
                    title="Delete"
                  >
                    {isDeleting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
