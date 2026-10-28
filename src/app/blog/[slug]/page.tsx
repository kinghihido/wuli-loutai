import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { getPostBySlug } from '@/lib/blog';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16 px-6">
        <article className="max-w-3xl mx-auto">
          {/* 返回 */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 font-serif text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> 返回文章
          </Link>

          {/* 文章头 */}
          <header className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="font-serif text-sm text-primary tracking-wider">
                {post.category}
              </span>
              <span className="font-serif text-sm text-muted-foreground flex items-center gap-1">
                <Calendar className="w-3 h-3" /> {post.date}
              </span>
              <span className="font-serif text-sm text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" /> {post.readingTime} 分钟
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-wider mb-4 leading-snug">
              {post.title}
            </h1>
            <div className="ink-line max-w-sm mb-4" />
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-serif text-xs px-3 py-1 border border-border rounded text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* 正文 — 仿卷轴 */}
          <div className="scroll-card">
            <div className="p-8 sm:p-12">
              <div className="prose prose-neutral max-w-none font-serif
                prose-headings:font-semibold prose-headings:tracking-wider
                prose-h1:text-2xl prose-h1:mt-10 prose-h1:mb-6
                prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-4
                prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-3
                prose-p:leading-loose prose-p:mb-4 prose-p:tracking-wide
                prose-li:my-1 prose-li:leading-loose
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:border prose-code:border-border
                prose-pre:bg-muted prose-pre:rounded-lg prose-pre:border prose-pre:border-border
                prose-img:rounded-lg
                prose-blockquote:border-l-primary prose-blockquote:bg-muted/30 prose-blockquote:py-2 prose-blockquote:px-5 prose-blockquote:rounded-r-lg prose-blockquote:italic
                prose-hr:border-border
                prose-strong:font-semibold
                ">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {post.content}
                </ReactMarkdown>
              </div>
            </div>
          </div>

          {/* 文末 */}
          <div className="mt-10 pt-8">
            <div className="ink-line mb-6" />
            <div className="flex items-center justify-between">
              <Link
                href="/blog"
                className="inline-flex items-center gap-1 font-serif text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> 返回文章列表
              </Link>
              <div className="seal-stamp" style={{ width: '2rem', height: '2rem', fontSize: '0.65rem' }}>
                终
              </div>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
