import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
};

export default nextConfig;
