import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { siteInfo } from '@/data/site';
import { getAllPosts } from '@/lib/blog';
import {
  Github, Terminal, BookOpen, Wrench, FolderGit2, Mail, MapPin,
  ArrowRight, Star, GitCommit, Calendar, ExternalLink,
} from 'lucide-react';

export function Dashboard() {
  const posts = getAllPosts().slice(0, 3);

  return (
    <main className="pt-16">
      {/* Hero */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Terminal className="w-4 h-4" />
            {siteInfo.location}
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            {siteInfo.title}
          </h1>
          <p className="text-xl text-muted-foreground mb-3">{siteInfo.subtitle}</p>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            {siteInfo.description}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="https://github.com/kinghihido" target="_blank">
              <Button variant="outline" className="gap-2">
                <Github className="w-4 h-4" /> GitHub
              </Button>
            </Link>
            <Link href="/blog">
              <Button className="gap-2">
                <BookOpen className="w-4 h-4" /> 阅读博客
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: BookOpen, label: '技术博客', href: '/blog', desc: `${posts.length}+ 篇文章` },
              { icon: Wrench, label: 'AI 工具集', href: '/tools', desc: '效率利器合集' },
              { icon: FolderGit2, label: '项目展示', href: '/projects', desc: 'GitHub 项目' },
              { icon: Mail, label: '关于我', href: '/about', desc: '个人简介' },
            ].map((item) => (
              <Link key={item.href} href={item.href}>
                <Card className="hover:shadow-md hover:border-primary/30 transition-all duration-200 h-full group">
                  <CardContent className="p-5 flex flex-col items-center text-center gap-2">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <item.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold">{item.label}</h3>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* GitHub Stats & Latest Posts */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {/* GitHub Stats */}
          <div className="md:col-span-1">
            <Card className="h-full">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Github className="w-5 h-5 text-primary" />
                  <h2 className="font-semibold">GitHub</h2>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">
                    B
                  </div>
                  <div>
                    <p className="font-medium">kinghihido</p>
                    <p className="text-sm text-muted-foreground">Black</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                    <span className="flex items-center gap-2"><Star className="w-4 h-4 text-muted-foreground" />仓库</span>
                    <span className="font-mono font-medium">3</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                    <span className="flex items-center gap-2"><GitCommit className="w-4 h-4 text-muted-foreground" />加入</span>
                    <span className="font-mono text-sm">2026.05</span>
                  </div>
                </div>
                <Link href="https://github.com/kinghihido" target="_blank" className="mt-4 block">
                  <Button variant="outline" size="sm" className="w-full gap-1">
                    访问主页 <ExternalLink className="w-3 h-3" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Latest Blog */}
          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                <h2 className="font-semibold">最新文章</h2>
              </div>
              <Link href="/blog">
                <Button variant="ghost" size="sm" className="gap-1">
                  全部文章 <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </div>
            <div className="space-y-3">
              {posts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`}>
                  <Card className="hover:shadow-md hover:border-primary/30 transition-all duration-200">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="secondary" className="text-xs">{post.category}</Badge>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Calendar className="w-3 h-3" />{post.date}
                            </span>
                          </div>
                          <h3 className="font-semibold truncate">{post.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{post.excerpt}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-2" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-center font-semibold text-lg mb-8">技术栈</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {siteInfo.skills.map((skill) => (
              <Badge key={skill} variant="secondary" className="px-4 py-2 text-sm">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
