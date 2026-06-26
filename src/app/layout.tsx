import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Black Geek | Personal Tech Hub',
    template: '%s | Black Geek',
  },
  description: 'Black 的个人极客空间 — 技术博客、AI 工具、项目展示、个人仪表盘',
  keywords: ['Black', '极客', '技术博客', 'AI', 'GitHub', '北京大学'],
  authors: [{ name: 'Black', url: 'https://github.com/kinghihido' }],
  generator: 'Next.js',
  openGraph: {
    title: 'Black Geek | Personal Tech Hub',
    description: '技术博客、AI 工具、项目展示、个人仪表盘',
    type: 'website',
    locale: 'zh_CN',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
