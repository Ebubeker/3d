import { ImageResponse } from 'next/og';

// Default Open Graph image used across the site. Generated on the edge
// from text + inline styles via Next.js's ImageResponse, so we don't
// need a static asset file or a designer in the loop. If you want a
// per-page image (e.g. a hero render on /solutions), drop another
// `opengraph-image.tsx` into that route folder and Next will use it
// in preference to this one.

export const runtime = 'edge';
export const alt = 'virtuality.fashion — virtual sampling and tech pack services';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          backgroundColor: '#000000',
          color: '#ffffff',
          padding: 80,
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        }}
      >
        {/* Top eyebrow */}
        <div
          style={{
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: 4,
            textTransform: 'uppercase',
            color: '#9ca3af',
          }}
        >
          Since 2015
        </div>

        {/* Main wordmark + tagline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div
            style={{
              fontSize: 96,
              fontWeight: 800,
              letterSpacing: -3,
              lineHeight: 1,
            }}
          >
            virtuality.fashion
          </div>
          <div
            style={{
              fontSize: 36,
              color: '#d1d5db',
              maxWidth: 980,
              lineHeight: 1.3,
            }}
          >
            Virtual sampling, tech packs, and 3D fashion design for leading brands
          </div>
        </div>

        {/* Bottom rule + caption */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 24,
            width: '100%',
          }}
        >
          <div
            style={{
              height: 2,
              backgroundColor: '#374151',
              flex: 1,
              display: 'flex',
            }}
          />
          <div
            style={{
              fontSize: 22,
              color: '#9ca3af',
              letterSpacing: 2,
              textTransform: 'uppercase',
            }}
          >
            CLO3D · Browzwear · Marvelous Designer
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
