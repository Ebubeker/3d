import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '100mb',
    },
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_APP_SUPABASE_URI,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_APP_SUPABASE_ANON,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Permanent redirects for legacy WordPress/Wix URLs that Google still
  // indexes from the old site. Next.js strips trailing slashes before
  // matching, so /pricing/ is covered by /pricing.
  async redirects() {
    return [
      { source: '/pricing', destination: '/solutions', permanent: true },
      { source: '/how-it-works', destination: '/solutions', permanent: true },
      { source: '/gallery', destination: '/solutions', permanent: true },
      { source: '/hello-world', destination: '/blog', permanent: true },
      { source: '/post/:slug*', destination: '/blog', permanent: true },
      { source: '/category/:slug*', destination: '/blog', permanent: true },
      { source: '/tag/:slug*', destination: '/blog', permanent: true },
      { source: '/author/:slug*', destination: '/blog', permanent: true },
      // WordPress dated permalinks, e.g. /2021/05/12/some-post and /2021/05/some-post
      {
        source: '/:year(\\d{4})/:month(\\d{2})/:day(\\d{2})/:slug',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/:year(\\d{4})/:month(\\d{2})/:slug',
        destination: '/blog',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
