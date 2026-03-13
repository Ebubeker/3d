'use client';

import { useState } from 'react';

interface PdfThumbnailProps {
  url: string;
  className?: string;
}

// Derives the thumbnail URL from a PDF URL
// e.g., uploads/123-abc.pdf -> uploads/123-abc_thumb.png
function getThumbnailUrl(pdfUrl: string): string {
  return pdfUrl.replace(/\.pdf$/i, '_thumb.png');
}

export default function PdfThumbnail({ url, className = '' }: PdfThumbnailProps) {
  const [error, setError] = useState(false);
  const thumbnailUrl = getThumbnailUrl(url);

  if (error) {
    return (
      <div className={`w-full h-full bg-gray-50 flex items-center justify-center ${className}`}>
        <span className="text-red-500 text-xs font-medium">PDF</span>
      </div>
    );
  }

  return (
    <div className={`w-full h-full relative overflow-hidden ${className}`}>
      <img
        src={thumbnailUrl}
        alt="PDF thumbnail"
        className="w-full h-full object-cover"
        onError={() => setError(true)}
      />
    </div>
  );
}
