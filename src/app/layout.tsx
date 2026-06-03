import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: '竞海西渡 | 文学与摄影',
    template: '%s | 竞海西渡',
  },
  description: '竞海西渡的文学与摄影作品集，记录生活中的诗意与光影',
  keywords: [
    '竞海西渡',
    '文学',
    '摄影',
    '作品集',
    '摄影作品',
    '文学作品',
    '诗人',
    '摄影师',
  ],
  authors: [{ name: '竞海西渡' }],
  generator: 'Coze Code',
  openGraph: {
    title: '竞海西渡 | 文学与摄影',
    description: '用文字书写诗意，用镜头捕捉光影',
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
      <body className={`antialiased`}>
        {children}
      </body>
    </html>
  );
}
