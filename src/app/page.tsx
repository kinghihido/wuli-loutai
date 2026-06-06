'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { 
  PenTool, 
  Camera, 
  Mail, 
  Github, 
  Twitter, 
  BookOpen,
  Image as ImageIcon,
  Pencil,
  Loader2,
  Settings,
  X,
  Check,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import { HeroCarousel } from '@/components/ui/hero-carousel';

interface SiteData {
  hero: {
    title: string;
    subtitle: string;
    description: string;
  };
  about: {
    paragraphs: string[];
    tags: string[];
  };
  literaryWorks: { id: number; title: string }[];
  photographyWorks: { id: number; title: string }[];
}

const defaultData: SiteData = {
  hero: {
    title: '用文字书写诗意',
    subtitle: '用镜头捕捉光影',
    description: '我是竞海西渡，一个热爱文学与摄影的创作者。在这里，记录生活中的诗意与美好。',
  },
  about: {
    paragraphs: [
      '我是竞海西渡，一个热爱文学与摄影的创作者，现求学于燕园。在文字的世界里，我寻找生活的诗意；在镜头的光影中，我捕捉世界的美好。',
      '文学让我学会用文字表达内心的情感与思考，摄影让我学会用镜头观察世界的细节与瞬间。两者相辅相成，成为我认识世界、表达自我的方式。',
      '我相信，生活中处处都有诗意，只需要用心去发现。希望我的作品能带给你一些美好的感受。',
    ],
    tags: ['散文创作', '风光摄影', '人文纪实'],
  },
  literaryWorks: [],
  photographyWorks: [],
};

export default function Home() {
  const [data, setData] = useState<SiteData>(defaultData);
  const [isLoading, setIsLoading] = useState(true);

  const [editMode, setEditMode] = useState(false);
  const [editingHero, setEditingHero] = useState(false);
  const [editingAbout, setEditingAbout] = useState(false);

  const [heroForm, setHeroForm] = useState(data.hero);
  const [heroImages, setHeroImages] = useState<{ id: string; url: string }[]>([]);
  const [aboutForm, setAboutForm] = useState(data.about);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    fetch('/api/site-data')
      .then(res => res.json())
      .then(resData => {
        const merged = { ...defaultData, ...resData };
        setData(merged);
        setHeroForm(resData.hero || defaultData.hero);
        setAboutForm(resData.about || defaultData.about);
        setHeroImages(resData.heroImages || []);
      })
      .catch(() => {
        setData(defaultData);
        setHeroForm(defaultData.hero);
        setAboutForm(defaultData.about);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const enterEditMode = () => {
    if (password === '114514') {
      setEditMode(true);
      setShowPasswordModal(false);
      setPassword('');
      setPasswordError('');
      sessionStorage.setItem('adminAuth', 'true');
    } else {
      setPasswordError('密码错误，请重试');
    }
  };

  const exitEditMode = () => {
    setEditMode(false);
    sessionStorage.removeItem('adminAuth');
  };

  const handleManageClick = () => {
    if (editMode) {
      exitEditMode();
    } else {
      if (sessionStorage.getItem('adminAuth') === 'true') {
        setEditMode(true);
      } else {
        setShowPasswordModal(true);
      }
    }
  };

  const saveHero = async () => {
    try {
      await fetch('/api/site-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hero: heroForm }),
      });
      setData(prev => ({ ...prev, hero: heroForm }));
      setEditingHero(false);
    } catch (error) {
      console.error('Save hero error:', error);
    }
  };

  const saveHeroImages = async (images: { id: string; url: string }[]) => {
    try {
      await fetch('/api/site-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ heroImages: images }),
      });
      setHeroImages(images);
    } catch (error) {
      console.error('Save hero images error:', error);
    }
  };

  const saveAbout = async () => {
    try {
      await fetch('/api/site-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ about: aboutForm }),
      });
      setData(prev => ({ ...prev, about: aboutForm }));
      setEditingAbout(false);
    } catch (error) {
      console.error('Save about error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* 导航栏 */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <PenTool className="w-4 h-4 text-primary" />
            </div>
            <span className="font-medium text-lg">竞海西渡</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/works">
              <Button variant="ghost" size="sm" className="gap-1">
                <BookOpen className="w-4 h-4" />
                作品集
              </Button>
            </Link>
            <Button
              variant={editMode ? "default" : "outline"}
              size="sm"
              className="gap-1"
              onClick={handleManageClick}
            >
              <Settings className="w-3 h-3" />
              {editMode ? '完成' : '管理'}
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero 全屏图片轮播 */}
      <section className="relative pt-16">
        <HeroCarousel
          images={heroImages}
          onChange={saveHeroImages}
          editMode={editMode}
          title={data.hero.title}
          subtitle={data.hero.subtitle}
          description={data.hero.description}
        />
        
        {editMode && (
          <div className="absolute top-20 left-4 z-20">
            <Button 
              variant="secondary"
              size="sm"
              className="gap-1 bg-white/90 hover:bg-white shadow-md"
              onClick={() => {
                setHeroForm(data.hero);
                setEditingHero(true);
              }}
            >
              <Pencil className="w-3 h-3" /> 编辑背景语
            </Button>
          </div>
        )}
        
        <Dialog open={editingHero} onOpenChange={setEditingHero}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>编辑背景语</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium mb-2 block">主标题</label>
                <Input value={heroForm.title} onChange={(e) => setHeroForm(prev => ({ ...prev, title: e.target.value }))} placeholder="例如：惟励莫肄 勇取进绩" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">副标题</label>
                <Input value={heroForm.subtitle} onChange={(e) => setHeroForm(prev => ({ ...prev, subtitle: e.target.value }))} placeholder="例如：用文字书写诗意" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">个人介绍</label>
                <Textarea value={heroForm.description} onChange={(e) => setHeroForm(prev => ({ ...prev, description: e.target.value }))} placeholder="简要介绍自己" rows={3} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingHero(false)}>取消</Button>
              <Button onClick={saveHero} className="gap-1"><Check className="w-3 h-3" /> 保存</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>

      {/* 作品集入口 */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <Link href="/works" className="block">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-accent/10 to-primary/5 border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 group cursor-pointer p-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-3 group-hover:text-primary transition-colors">作品集</h2>
                  <p className="text-muted-foreground text-lg">文学与摄影，是我观察世界的两种方式</p>
                  {data.literaryWorks.length + data.photographyWorks.length > 0 && (
                    <div className="flex gap-3 mt-4">
                      <Badge variant="secondary" className="gap-1"><BookOpen className="w-3 h-3" />{data.literaryWorks.length} 篇文学</Badge>
                      <Badge variant="secondary" className="gap-1"><Camera className="w-3 h-3" />{data.photographyWorks.length} 张摄影</Badge>
                    </div>
                  )}
                </div>
                <div className="hidden sm:flex items-center gap-2 text-primary font-medium group-hover:translate-x-1 transition-transform">
                  浏览作品 <ArrowRight className="w-5 h-5" />
                </div>
              </div>
              <div className="sm:hidden mt-4 flex items-center gap-2 text-primary font-medium">
                浏览作品 <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* 关于我 */}
      <section id="about" className="py-20 px-6 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-3xl font-bold">关于我</h2>
                {editMode && !editingAbout && (
                  <Button variant="outline" size="sm" className="gap-1"
                    onClick={() => { setAboutForm(data.about); setEditingAbout(true); }}>
                    <Pencil className="w-3 h-3" /> 编辑
                  </Button>
                )}
              </div>
              
              {editingAbout ? (
                <div className="space-y-4">
                  {aboutForm.paragraphs.map((p, i) => (
                    <Textarea key={i} value={p}
                      onChange={(e) => {
                        const newParagraphs = [...aboutForm.paragraphs];
                        newParagraphs[i] = e.target.value;
                        setAboutForm(prev => ({ ...prev, paragraphs: newParagraphs }));
                      }}
                      placeholder={`段落 ${i + 1}`} rows={3} />
                  ))}
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => {
                      setAboutForm(prev => ({ ...prev, paragraphs: [...prev.paragraphs, ''] }));
                    }}>+ 添加段落</Button>
                  </div>
                  <Input value={aboutForm.tags.join(', ')}
                    onChange={(e) => setAboutForm(prev => ({ 
                      ...prev, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                    }))}
                    placeholder="标签（用逗号分隔）" />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={saveAbout} className="gap-1"><Check className="w-3 h-3" /> 保存</Button>
                    <Button size="sm" variant="outline" onClick={() => setEditingAbout(false)}><X className="w-3 h-3" /> 取消</Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-4 text-muted-foreground">
                    {data.about.paragraphs.map((p, i) => (<p key={i}>{p}</p>))}
                  </div>
                  <div className="flex flex-wrap gap-3 mt-8">
                    {data.about.tags.map((tag, i) => (
                      <Badge key={i} variant="secondary" className="px-4 py-2">
                        {i === 0 && <PenTool className="w-3 h-3 mr-2" />}
                        {i === 1 && <Camera className="w-3 h-3 mr-2" />}
                        {i === 2 && <ImageIcon className="w-3 h-3 mr-2" />}
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/10 via-accent/20 to-primary/5 p-8 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4 opacity-20">文</div>
                  <div className="text-sm text-muted-foreground">文字与光影</div>
                </div>
              </div>
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary/5 rounded-full" />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-accent/10 rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* 联系方式 */}
      <section id="contact" className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">保持联系</h2>
          <p className="text-muted-foreground mb-8">
            如果你想与我交流创作，或者有任何合作意向，欢迎联系我
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="outline" size="lg" className="gap-2"><Mail className="w-4 h-4" />邮箱联系</Button>
            <Button variant="outline" size="lg" className="gap-2"><Github className="w-4 h-4" />GitHub</Button>
            <Button variant="outline" size="lg" className="gap-2"><Twitter className="w-4 h-4" />Twitter</Button>
          </div>
        </div>
      </section>

      {/* 页脚 */}
      <footer className="py-8 px-6 border-t border-border">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
              <PenTool className="w-3 h-3 text-primary" />
            </div>
            <span>竞海西渡</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} 竞海西渡. All rights reserved.
          </p>
        </div>
      </footer>

      {/* 密码验证弹窗 */}
      <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Settings className="w-5 h-5" />管理验证</DialogTitle>
            <DialogDescription>请输入管理密码进入编辑模式</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input type="password" value={password}
              onChange={(e) => { setPassword(e.target.value); setPasswordError(''); }}
              placeholder="请输入密码"
              onKeyDown={(e) => { if (e.key === 'Enter') enterEditMode(); }} />
            {passwordError && <p className="text-sm text-destructive mt-2">{passwordError}</p>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowPasswordModal(false); setPassword(''); setPasswordError(''); }}>取消</Button>
            <Button onClick={enterEditMode}>确认</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
