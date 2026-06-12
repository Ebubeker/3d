// Single source of truth for the site's public origin. Every absolute URL
// the app emits (canonicals, Open Graph, sitemap, robots, RSS, JSON-LD,
// email links) must be built from this constant so the host stays
// consistent site-wide. The canonical host is the www variant — keep the
// fallback in sync with NEXT_PUBLIC_SITE_URL in production.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://www.virtuality.fashion';
