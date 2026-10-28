import Link from 'next/link';
import { siteInfo } from '@/data/site';
import { getAllPosts } from '@/lib/blog';
import { BookOpen, Calendar, ArrowRight } from 'lucide-react';

export function Dashboard() {
  const posts = getAllPosts().slice(0, 5);
  const totalPosts = getAllPosts().length;

  return (
    <main className="pt-16">
      {/* 首屏 — 仿水墨画留白 */}
      <section className="py-28 px-6 paper-texture">
        <div className="max-w-3xl mx-auto text-center">
          {/* 印章 */}
          <div className="mb-8 animate-ink-spread">
            <div className="seal-stamp mx-auto" style={{ width: '4rem', height: '4rem', fontSize: '1.25rem' }}>
              雾
            </div>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-wider mb-6 animate-fade-up">
            {siteInfo.title}
          </h1>

          <div className="ink-line max-w-xs mx-auto mb-6" />

          <p className="font-serif text-xl sm:text-2xl text-muted-foreground tracking-widest mb-4 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            {siteInfo.subtitle}
          </p>
          <p className="font-serif text-muted-foreground max-w-lg mx-auto leading-relaxed mb-10 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            {siteInfo.description}
          </p>

          <div className="flex flex-wrap justify-center gap-6 animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <Link
              href="/blog"
              className="group inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-serif tracking-wider rounded hover:opacity-90 transition-opacity"
            >
              <BookOpen className="w-4 h-4" />
              阅读文章
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href={siteInfo.github}
              target="_blank"
              className="inline-flex items-center gap-2 px-6 py-3 border border-border text-foreground font-serif tracking-wider rounded hover:bg-muted/50 transition-colors"
            >
              GitHub
            </Link>
          </div>
        </div>
      </section>

      {/* 分隔 — 水墨线 */}
      <div className="ink-line max-w-md mx-auto" />

      {/* 最新文章 — 仿古籍目录 */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="seal-stamp" style={{ width: '2rem', height: '2rem', fontSize: '0.7rem' }}>
                文
              </div>
              <h2 className="font-serif text-xl font-semibold tracking-wider">最新文章</h2>
            </div>
            <Link
              href="/blog"
              className="font-serif text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
            >
              全部 {totalPosts} 篇 <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-16">
              <p className="font-serif text-muted-foreground tracking-wider">
                尚无文章，敬请期待
              </p>
            </div>
          ) : (
            <div className="space-y-0">
              {posts.map((post, i) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group block"
                >
                  <div className="py-6 border-b border-border/60 hover:bg-muted/30 transition-colors px-4 -mx-4 rounded">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-serif text-xs text-primary tracking-wider">
                            {post.category}
                          </span>
                          <span className="font-serif text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {post.date}
                          </span>
                        </div>
                        <h3 className="font-serif text-lg font-semibold tracking-wide group-hover:text-primary transition-colors mb-1">
                          {post.title}
                        </h3>
                        <p className="font-serif text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                          {post.excerpt}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-6 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 分隔 */}
      <div className="ink-line max-w-md mx-auto" />

      {/* 关于 — 简短自述 */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="seal-stamp" style={{ width: '2rem', height: '2rem', fontSize: '0.7rem' }}>
              我
            </div>
            <h2 className="font-serif text-xl font-semibold tracking-wider">关于作者</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            <div className="sm:col-span-2">
              <p className="font-serif text-muted-foreground leading-loose tracking-wide">
                {siteInfo.description}
              </p>
              <p className="font-serif text-muted-foreground leading-loose tracking-wide mt-4">
                目前在北大从事材料方向研究，同时对 AI 技术应用充满热情。
                课余喜欢踢球、写代码、折腾各种 AI 工具。这个网站就是我记录思考、整理感悟的地方。
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-1 mt-4 font-serif text-sm text-primary hover:underline"
              >
                了解更多 <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center">
                <span className="font-serif text-3xl font-bold text-primary">B</span>
              </div>
              <span className="font-serif text-sm text-muted-foreground tracking-wider">{siteInfo.location}</span>
              <span className="font-serif text-xs text-muted-foreground">{siteInfo.role}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 底部分隔 */}
      <div className="ink-line max-w-md mx-auto" />

      {/* 底部诗词装饰 */}
      <section className="py-16 px-6 text-center">
        <p className="font-serif text-sm text-muted-foreground/60 tracking-widest leading-loose">
          雾失楼台 &middot; 月迷津渡 &middot; 桃源望断无寻处
        </p>
      </section>
    </main>
  );
}
