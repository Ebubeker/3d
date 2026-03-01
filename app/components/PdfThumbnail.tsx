'use client';

import { useEffect, useRef, useState } from 'react';

interface PdfThumbnailProps {
  url: string;
  className?: string;
}

export default function PdfThumbnail({ url, className = '' }: PdfThumbnailProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    let blobUrl: string | null = null;

    async function renderPdf() {
      try {
        const pdfjsLib = await import('pdfjs-dist');
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

        // Fetch as blob to avoid CORS issues with pdfjs direct URL loading
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch PDF');
        const blob = await response.blob();
        blobUrl = URL.createObjectURL(blob);

        const pdf = await pdfjsLib.getDocument(blobUrl).promise;
        if (cancelled) return;

        const page = await pdf.getPage(1);
        if (cancelled) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const container = canvas.parentElement;
        const containerWidth = container?.clientWidth || 300;
        const containerHeight = container?.clientHeight || 300;

        const viewport = page.getViewport({ scale: 1 });
        const scale = Math.max(
          containerWidth / viewport.width,
          containerHeight / viewport.height
        );
        const scaledViewport = page.getViewport({ scale });

        canvas.width = scaledViewport.width;
        canvas.height = scaledViewport.height;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await page.render({ canvasContext: ctx, viewport: scaledViewport, canvas } as any).promise;
        if (!cancelled) setLoading(false);
      } catch (err) {
        console.error('PdfThumbnail render error:', err);
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      }
    }

    renderPdf();
    return () => {
      cancelled = true;
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [url]);

  if (error) {
    return (
      <div className={`w-full h-full bg-gray-50 flex items-center justify-center ${className}`}>
        <span className="text-red-500 text-xs font-medium">PDF</span>
      </div>
    );
  }

  return (
    <div className={`w-full h-full relative overflow-hidden ${className}`}>
      {loading && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
          <span className="text-gray-400 text-xs">Loading...</span>
        </div>
      )}
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover"
        style={{ display: loading ? 'none' : 'block' }}
      />
    </div>
  );
}
