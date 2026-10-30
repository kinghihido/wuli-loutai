import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/wuli-loutai',
  // 静态导出到 GitHub Pages 时，路由 /blog 会导出成 blog.html，
  // 而站内链接仍是 /blog —— Pages 不会做这个映射，点导航直接 404。
  // 开 trailingSlash 后导出成 blog/index.html，链接变成 /blog/，Pages 能正确解析。
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
