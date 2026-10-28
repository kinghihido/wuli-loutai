import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { getAllPosts, getAllCategories } from '@/lib/blog';
import { BookOpen, Calendar, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function BlogPage() {
  const posts = getAllPosts();
  const categories = getAllCategories();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          {/* 标题区 */}
          <div className="mb-12 text-center">
            <div className="seal-stamp mx-auto mb-6" style={{ width: '3rem', height: '3rem', fontSize: '1rem' }}>
              文
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-wider mb-3">文章</h1>
            <div className="ink-line max-w-xs mx-auto mb-4" />
            <p className="font-serif text-muted-foreground tracking-wide">
              共 {posts.length} 篇 &middot; 记录思考与感悟
            </p>
            {categories.length > 0 && (
              <div className="flex flex-wrap justify-center gap-3 mt-6">
                {categories.map((cat) => (
                  <span
                    key={cat}
                    className="font-serif text-sm px-4 py-1.5 border border-border rounded text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors cursor-default"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 文章列表 */}
          {posts.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
              <p className="font-serif text-muted-foreground tracking-wider">
                尚无文章 &middot; 敬请期待
              </p>
            </div>
          ) : (
            <div className="space-y-0">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group block"
                >
                  <article className="py-7 border-b border-border/60 hover:bg-muted/20 transition-colors px-4 -mx-4 rounded">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        {/* 元信息 */}
                        <div className="flex items-center gap-3 mb-2.5">
                          <span className="font-serif text-xs text-primary tracking-wider">
                            {post.category}
                          </span>
                          <span className="font-serif text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {post.date}
                          </span>
                          <span className="font-serif text-xs text-muted-foreground">
                            {post.readingTime} 分钟
                          </span>
                        </div>
                        {/* 标题 */}
                        <h2 className="font-serif text-xl font-semibold tracking-wide group-hover:text-primary transition-colors mb-2">
                          {post.title}
                        </h2>
                        {/* 摘要 */}
                        <p className="font-serif text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                          {post.excerpt}
                        </p>
                        {/* 标签 */}
                        {post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {post.tags.map((tag) => (
                              <span
                                key={tag}
                                className="font-serif text-xs px-2 py-0.5 border border-border/80 rounded text-muted-foreground"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-8 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
