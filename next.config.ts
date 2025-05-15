import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [new URL('https://source.unsplash.com/random/800x600')],
  },
};

export default nextConfig;
