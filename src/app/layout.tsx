import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: '雾里楼台',
    template: '%s | 雾里楼台',
  },
  description: '雾里楼台 — 一个北大学生的创作空间，记录随感、日记与长文。',
  keywords: ['雾里楼台', '创作', '随笔', '日记', '文学', '北京大学'],
  authors: [{ name: 'Black', url: 'https://github.com/kinghihido' }],
  generator: 'Next.js',
  openGraph: {
    title: '雾里楼台',
    description: '一个北大学生的创作空间',
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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@200;300;400;500;600;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
