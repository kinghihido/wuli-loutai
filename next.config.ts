import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/wuli-loutai',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
