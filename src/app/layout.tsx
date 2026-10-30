import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: '层林尽染',
    template: '%s | 层林尽染',
  },
  description: '层林尽染 — 一个北大学生的技术笔记，记录 AI 工具链、材料实验方法与前端工程化。',
  keywords: ['层林尽染', '技术', 'AI 工具链', '材料科学', '前端开发', '北京大学'],
  authors: [{ name: 'Black', url: 'https://github.com/kinghihido' }],
  generator: 'Next.js',
  openGraph: {
    title: '层林尽染',
    description: '一个北大学生的技术笔记，记录 AI 工具链、材料实验方法与前端工程化',
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
