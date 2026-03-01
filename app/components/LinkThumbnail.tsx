'use client';

import { ExternalLink } from 'lucide-react';
import type { LinkEntry } from '@/lib/supabase/types';

interface LinkThumbnailProps {
  entry: LinkEntry;
  className?: string;
}

export default function LinkThumbnail({ entry, className = '' }: LinkThumbnailProps) {
  if (entry.type === 'image') {
    return (
      <a href={entry.link} target="_blank" rel="noopener noreferrer" className={`block w-full h-full ${className}`}>
        <img
          src={entry.link}
          alt={entry.label}
          className="w-full h-full object-cover"
        />
      </a>
    );
  }

  if (entry.type === 'video') {
    return (
      <div className={`w-full h-full relative ${className}`}>
        <video
          src={entry.link}
          className="w-full h-full object-cover"
          preload="metadata"
          playsInline
          muted
          loop
          onMouseEnter={(e) => e.currentTarget.play()}
          onMouseLeave={(e) => {
            e.currentTarget.pause();
            e.currentTarget.currentTime = 0;
          }}
        />
      </div>
    );
  }

  // type: 'link' — styled card
  return (
    <a
      href={entry.link}
      target="_blank"
      rel="noopener noreferrer"
      className={`w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 text-white p-3 group ${className}`}
    >
      <ExternalLink className="w-5 h-5 mb-2 opacity-60 group-hover:opacity-100 transition-opacity" />
      <span className="text-xs sm:text-sm font-medium text-center leading-tight line-clamp-2">
        {entry.label}
      </span>
    </a>
  );
}
