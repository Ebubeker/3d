import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

// AI search crawlers are listed explicitly (not just covered by the
// wildcard) so a future rule change cannot silently lock them out.
// Being crawlable by these is how the site gets cited in ChatGPT,
// Claude, Perplexity, and Google AI Overviews. Training crawlers
// (CCBot etc.) stay allowed via the wildcard on purpose: brand
// presence inside future models is upside for a services business.
const AI_SEARCH_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'PerplexityBot',
];

export default function robots(): MetadataRoute.Robots {
  const disallow = ['/admin/', '/api/'];
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow,
      },
      ...AI_SEARCH_CRAWLERS.map((userAgent) => ({
        userAgent,
        allow: '/',
        disallow,
      })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
