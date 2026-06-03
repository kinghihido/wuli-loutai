'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
  ChevronRight,
  Quote,
  Calendar,
  Pencil,
  Plus,
  Upload,
  Loader2,
  Settings,
  X,
  Check,
  ImageIcon as PhotoIcon,
  Trash2,
  AlertTriangle,
  Target,
  Wallet,
  Menu,
} from 'lucide-react';
import { TaskList, Task } from '@/components/ui/task-list';
import { Assets } from '@/components/ui/assets';
import { Voucher, VoucherType } from '@/components/ui/voucher';
import { HeroCarousel } from '@/components/ui/hero-carousel';

// 数据类型定义
interface LiteraryWork {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  content: string;
}

interface PhotographyWork {
  id: number;
  title: string;
  description: string;
  category: string;
  image: string;
}

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
  literaryWorks: LiteraryWork[];
  photographyWorks: PhotographyWork[];
  tasks: Task[];
  vouchers: Voucher[];
  usedVouchers: { voucher: Voucher; usedAt: string }[];
  donggeUsedCount: number;
  coins: number;
}

// 默认数据
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
  tasks: [],
  vouchers: [],
  usedVouchers: [],
  donggeUsedCount: 0,
  coins: 0,
};

// 页面类型
type PageView = 'home' | 'tasks' | 'assets';

export default function Home() {
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [activeTab, setActiveTab] = useState<'literature' | 'photography'>('literature');
  const [selectedWork, setSelectedWork] = useState<LiteraryWork | null>(null);
  const [data, setData] = useState<SiteData>(defaultData);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 编辑状态
  const [editMode, setEditMode] = useState(false);
  const [editingHero, setEditingHero] = useState(false);
  const [editingAbout, setEditingAbout] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showPhotoUploadModal, setShowPhotoUploadModal] = useState(false);

  // 编辑表单
  const [heroForm, setHeroForm] = useState(data.hero);
  const [heroImages, setHeroImages] = useState<{ id: string; url: string }[]>([]);
  const [aboutForm, setAboutForm] = useState(data.about);

  // 文学上传表单
  const [uploadForm, setUploadForm] = useState({
    title: '',
    content: '',
    category: '散文',
    date: new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' }),
  });
  const [isUploading, setIsUploading] = useState(false);

  // 摄影上传表单
  const [photoForm, setPhotoForm] = useState({
    title: '',
    description: '',
    category: '风光',
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 密码验证
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // 编辑作品
  const [editingWork, setEditingWork] = useState<LiteraryWork | null>(null);
  const [editingPhoto, setEditingPhoto] = useState<PhotographyWork | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'literary' | 'photography'; id: number } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // 加载数据
  useEffect(() => {
    fetch('/api/site-data')
      .then(res => res.json())
      .then(resData => {
        setData({ ...defaultData, ...resData });
        setHeroForm(resData.hero || defaultData.hero);
        setAboutForm(resData.about || defaultData.about);
        setHeroImages(resData.heroImages || []);
      })
      .catch(() => {
        setData(defaultData);
        setHeroForm(defaultData.hero);
        setAboutForm(defaultData.about);
        setHeroImages([]);
      })
      .finally(() => setIsLoading(false));
  }, []);

  // 验证密码并进入管理模式
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

  // 退出管理模式
  const exitEditMode = () => {
    setEditMode(false);
    sessionStorage.removeItem('adminAuth');
  };

  // 点击管理按钮
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

  // 重新加载数据
  const reloadData = async () => {
    const res = await fetch('/api/site-data');
    const newData = await res.json();
    setData(prev => ({ ...prev, ...newData }));
  };

  // === 任务相关操作 ===
  const handleAddTask = async (taskData: Omit<Task, 'id' | 'completed' | 'createdAt'>) => {
    try {
      const res = await fetch('/api/task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });
      const resData = await res.json();
      if (resData.success) {
        reloadData();
      }
    } catch (error) {
      console.error('Add task error:', error);
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      const res = await fetch('/api/task', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId, action: 'complete' }),
      });
      const resData = await res.json();
      if (resData.success) {
        reloadData();
        alert(`恭喜完成任务！获得 ${resData.reward} 代币`);
      } else if (resData.error) {
        alert(resData.error);
      }
    } catch (error) {
      console.error('Complete task error:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const res = await fetch(`/api/task?taskId=${taskId}`, {
        method: 'DELETE',
      });
      const resData = await res.json();
      if (resData.success) {
        reloadData();
      } else if (resData.error) {
        alert(resData.error);
      }
    } catch (error) {
      console.error('Delete task error:', error);
    }
  };

  // === 定向券相关操作 ===
  const handleUseVoucher = async (voucher: Voucher) => {
    try {
      const res = await fetch('/api/voucher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voucherId: voucher.id }),
      });
      const resData = await res.json();
      if (resData.success) {
        reloadData();
        alert(resData.message);
      }
    } catch (error) {
      console.error('Use voucher error:', error);
    }
  };

  // 转化自选券
  const handleConvertVoucher = async (voucherId: string, newType: VoucherType) => {
    try {
      const res = await fetch('/api/voucher/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voucherId, newType }),
      });
      const resData = await res.json();
      if (resData.success) {
        reloadData();
        alert(`成功转化为「${resData.newVoucher?.name || '定向券'}」`);
      }
    } catch (error) {
      console.error('Convert voucher error:', error);
    }
  };

  // 兑换券
  const handleExchange = async (type: VoucherType, cost: number) => {
    try {
      const res = await fetch('/api/exchange', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, cost }),
      });
      const resData = await res.json();
      if (resData.success) {
        reloadData();
      } else if (resData.error) {
        alert(resData.error);
      }
    } catch (error) {
      console.error('Exchange error:', error);
    }
  };

  // 更新冬戈券使用数
  const handleUpdateDonggeUsedCount = async (count: number) => {
    try {
      await fetch('/api/site-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ donggeUsedCount: count }),
      });
      setData(prev => ({ ...prev, donggeUsedCount: count }));
    } catch (error) {
      console.error('Update dongge count error:', error);
    }
  };

  // 保存Hero
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

  // 保存Hero图片
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

  // 保存About
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

  // 上传作品
  const handleUpload = async () => {
    if (!uploadForm.title.trim()) {
      alert('请输入作品标题');
      return;
    }
    if (!uploadForm.content.trim()) {
      alert('请输入文章内容');
      return;
    }
    
    setIsUploading(true);
    try {
      const res = await fetch('/api/upload-work', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(uploadForm),
      });
      const resData = await res.json();
      
      if (resData.success) {
        reloadData();
        setShowUploadModal(false);
        setUploadForm({
          title: '',
          content: '',
          category: '散文',
          date: new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' }),
        });
        alert('作品添加成功！');
      } else {
        alert(resData.error || '上传失败');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('上传失败，请重试');
    } finally {
      setIsUploading(false);
    }
  };

  // 选择图片文件
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('请选择图片文件');
        return;
      }
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 上传摄影作品
  const handlePhotoUpload = async () => {
    if (!photoForm.title.trim()) {
      alert('请输入作品标题');
      return;
    }
    if (!photoFile) {
      alert('请选择图片文件');
      return;
    }
    
    setIsUploadingPhoto(true);
    try {
      const formData = new FormData();
      formData.append('file', photoFile);
      formData.append('title', photoForm.title);
      formData.append('description', photoForm.description);
      formData.append('category', photoForm.category);

      const res = await fetch('/api/upload-photo', {
        method: 'POST',
        body: formData,
      });
      const resData = await res.json();
      
      if (resData.success) {
        reloadData();
        setShowPhotoUploadModal(false);
        setPhotoForm({ title: '', description: '', category: '风光' });
        setPhotoFile(null);
        setPhotoPreview('');
        alert('摄影作品添加成功！');
      } else {
        alert(resData.error || '上传失败');
      }
    } catch (error) {
      console.error('Upload photo error:', error);
      alert('上传失败，请重试');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  // 删除作品
  const handleDelete = async () => {
    if (!deleteTarget) return;
    
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/work?type=${deleteTarget.type}&id=${deleteTarget.id}`, {
        method: 'DELETE',
      });
      const resData = await res.json();
      
      if (resData.success) {
        reloadData();
        setDeleteTarget(null);
        alert('删除成功！');
      } else {
        alert(resData.error || '删除失败');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('删除失败，请重试');
    } finally {
      setIsDeleting(false);
    }
  };

  // 更新文学作品
  const handleUpdateWork = async () => {
    if (!editingWork) return;
    if (!editingWork.title.trim()) {
      alert('请输入作品标题');
      return;
    }
    if (!editingWork.content.trim()) {
      alert('请输入文章内容');
      return;
    }
    
    setIsSaving(true);
    try {
      const res = await fetch('/api/work', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'literary',
          id: editingWork.id,
          data: {
            title: editingWork.title,
            content: editingWork.content,
            category: editingWork.category,
            date: editingWork.date,
          },
        }),
      });
      const resData = await res.json();
      
      if (resData.success) {
        reloadData();
        setEditingWork(null);
        alert('更新成功！');
      } else {
        alert(resData.error || '更新失败');
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('更新失败，请重试');
    } finally {
      setIsSaving(false);
    }
  };

  // 更新摄影作品
  const handleUpdatePhoto = async () => {
    if (!editingPhoto) return;
    if (!editingPhoto.title.trim()) {
      alert('请输入作品标题');
      return;
    }
    
    setIsSaving(true);
    try {
      const res = await fetch('/api/work', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'photography',
          id: editingPhoto.id,
          data: {
            title: editingPhoto.title,
            description: editingPhoto.description,
            category: editingPhoto.category,
          },
        }),
      });
      const resData = await res.json();
      
      if (resData.success) {
        reloadData();
        setEditingPhoto(null);
        alert('更新成功！');
      } else {
        alert(resData.error || '更新失败');
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('更新失败，请重试');
    } finally {
      setIsSaving(false);
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
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <PenTool className="w-4 h-4 text-primary" />
            </div>
            <span className="font-medium text-lg">竞海西渡</span>
          </div>
          
          {/* 桌面端导航 */}
          <div className="hidden sm:flex items-center gap-6">
            <button
              onClick={() => setCurrentPage('home')}
              className={`text-sm transition-colors ${currentPage === 'home' ? 'text-primary font-medium' : 'text-muted-foreground hover:text-foreground'}`}
            >
              首页
            </button>
            <button
              onClick={() => setCurrentPage('tasks')}
              className={`text-sm transition-colors flex items-center gap-1 ${currentPage === 'tasks' ? 'text-primary font-medium' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Target className="w-4 h-4" />
              任务清单
            </button>
            <button
              onClick={() => setCurrentPage('assets')}
              className={`text-sm transition-colors flex items-center gap-1 ${currentPage === 'assets' ? 'text-primary font-medium' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Wallet className="w-4 h-4" />
              个人资产
              {data.vouchers.length > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs">{data.vouchers.length}</Badge>
              )}
            </button>
          </div>

          <div className="flex items-center gap-4">
            {/* 编辑模式开关 */}
            <Button
              variant={editMode ? "default" : "outline"}
              size="sm"
              className="gap-1"
              onClick={handleManageClick}
            >
              <Settings className="w-3 h-3" />
              {editMode ? '完成' : '管理'}
            </Button>
            
            {/* 移动端菜单按钮 */}
            <Button
              variant="ghost"
              size="sm"
              className="sm:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
        
        {/* 移动端菜单 */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-border bg-background">
            <div className="px-6 py-3 space-y-2">
              <button
                onClick={() => { setCurrentPage('home'); setMobileMenuOpen(false); }}
                className={`block w-full text-left py-2 ${currentPage === 'home' ? 'text-primary font-medium' : 'text-muted-foreground'}`}
              >
                首页
              </button>
              <button
                onClick={() => { setCurrentPage('tasks'); setMobileMenuOpen(false); }}
                className={`block w-full text-left py-2 flex items-center gap-2 ${currentPage === 'tasks' ? 'text-primary font-medium' : 'text-muted-foreground'}`}
              >
                <Target className="w-4 h-4" /> 任务清单
              </button>
              <button
                onClick={() => { setCurrentPage('assets'); setMobileMenuOpen(false); }}
                className={`block w-full text-left py-2 flex items-center gap-2 ${currentPage === 'assets' ? 'text-primary font-medium' : 'text-muted-foreground'}`}
              >
                <Wallet className="w-4 h-4" /> 个人资产
                {data.vouchers.length > 0 && (
                  <Badge variant="secondary" className="text-xs">{data.vouchers.length}</Badge>
                )}
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* 任务清单页面 */}
      {currentPage === 'tasks' && (
        <main className="pt-24 pb-20 px-6">
          <div className="max-w-3xl mx-auto">
            <TaskList
              tasks={data.tasks}
              onAddTask={handleAddTask}
              onCompleteTask={handleCompleteTask}
              onDeleteTask={handleDeleteTask}
              editMode={editMode}
              coins={data.coins}
            />
          </div>
        </main>
      )}

      {/* 个人资产页面 */}
      {currentPage === 'assets' && (
        <main className="pt-24 pb-20 px-6">
          <div className="max-w-4xl mx-auto">
            <Assets
              vouchers={data.vouchers}
              onUseVoucher={handleUseVoucher}
              onConvertVoucher={handleConvertVoucher}
              usedHistory={data.usedVouchers}
              donggeUsedCount={data.donggeUsedCount}
              onUpdateDonggeUsedCount={handleUpdateDonggeUsedCount}
              coins={data.coins}
              onExchange={handleExchange}
            />
          </div>
        </main>
      )}

      {/* 首页 */}
      {currentPage === 'home' && (
        <>
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
            
            {/* 编辑Hero文字按钮 - 浮在轮播上方 */}
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
            
            {/* Hero文字编辑弹窗 */}
            <Dialog open={editingHero} onOpenChange={setEditingHero}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>编辑背景语</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">主标题</label>
                    <Input
                      value={heroForm.title}
                      onChange={(e) => setHeroForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="例如：惟励莫肄 勇取进绩"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">副标题</label>
                    <Input
                      value={heroForm.subtitle}
                      onChange={(e) => setHeroForm(prev => ({ ...prev, subtitle: e.target.value }))}
                      placeholder="例如：用文字书写诗意"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">个人介绍</label>
                    <Textarea
                      value={heroForm.description}
                      onChange={(e) => setHeroForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="简要介绍自己"
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setEditingHero(false)}>取消</Button>
                  <Button onClick={saveHero} className="gap-1">
                    <Check className="w-3 h-3" /> 保存
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </section>

          {/* 快捷入口 */}
          <section className="py-12 px-6">
            <div className="max-w-5xl mx-auto">
              <div className="flex flex-wrap gap-4 justify-center">
                <Button size="lg" className="gap-2" asChild>
                  <a href="#works">
                    浏览作品
                    <ChevronRight className="w-4 h-4" />
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="gap-2" onClick={() => setCurrentPage('tasks')}>
                  <Target className="w-4 h-4" />
                  任务清单
                </Button>
              </div>
            </div>
          </section>

          {/* 作品展示区 */}
          <section id="works" className="py-20 px-6 bg-muted/30">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">作品集</h2>
                <p className="text-muted-foreground">文学与摄影，是我观察世界的两种方式</p>
              </div>

              {/* 标签切换 */}
              <div className="flex justify-center items-center gap-4 mb-10">
                <div className="flex gap-2">
                  <Button
                    variant={activeTab === 'literature' ? 'default' : 'outline'}
                    className="gap-2"
                    onClick={() => setActiveTab('literature')}
                  >
                    <BookOpen className="w-4 h-4" />
                    文学作品
                    {data.literaryWorks.length > 0 && (
                      <Badge variant="secondary" className="ml-1">{data.literaryWorks.length}</Badge>
                    )}
                  </Button>
                  <Button
                    variant={activeTab === 'photography' ? 'default' : 'outline'}
                    className="gap-2"
                    onClick={() => setActiveTab('photography')}
                  >
                    <Camera className="w-4 h-4" />
                    摄影作品
                    {data.photographyWorks.length > 0 && (
                      <Badge variant="secondary" className="ml-1">{data.photographyWorks.length}</Badge>
                    )}
                  </Button>
                </div>
                {editMode && (
                  <Button 
                    size="sm" 
                    className="gap-1"
                    onClick={() => activeTab === 'literature' ? setShowUploadModal(true) : setShowPhotoUploadModal(true)}
                  >
                    <Plus className="w-3 h-3" /> 添加作品
                  </Button>
                )}
              </div>

              {/* 文学作品 */}
              {activeTab === 'literature' && (
                <>
                  {data.literaryWorks.length === 0 ? (
                    <div className="text-center py-12">
                      <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                      <p className="text-muted-foreground mb-4">暂无文学作品</p>
                      {editMode && (
                        <Button onClick={() => setShowUploadModal(true)} className="gap-2">
                          <Upload className="w-4 h-4" /> 上传第一篇作品
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {data.literaryWorks.map((work) => (
                        <Card 
                          key={work.id} 
                          className="group cursor-pointer border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 relative"
                          onClick={() => !editMode && setSelectedWork(work)}
                        >
                          {editMode && (
                            <div className="absolute top-2 right-2 z-10 flex gap-1">
                              <Button
                                size="sm"
                                variant="secondary"
                                className="h-8 w-8 p-0"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingWork({ ...work });
                                }}
                              >
                                <Pencil className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                className="h-8 w-8 p-0"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeleteTarget({ type: 'literary', id: work.id });
                                }}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          )}
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-3">
                              <Badge variant="secondary">{work.category}</Badge>
                              <span className="text-xs text-muted-foreground">{work.date}</span>
                            </div>
                            <h3 className="font-semibold text-lg mb-3 group-hover:text-primary transition-colors">
                              {work.title}
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                              {work.excerpt}
                            </p>
                            <div className="mt-4 flex items-center text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                              阅读全文
                              <ChevronRight className="w-4 h-4 ml-1" />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* 摄影作品 */}
              {activeTab === 'photography' && (
                <>
                  {data.photographyWorks.length === 0 ? (
                    <div className="text-center py-12">
                      <Camera className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                      <p className="text-muted-foreground mb-4">暂无摄影作品</p>
                      {editMode && (
                        <Button onClick={() => setShowPhotoUploadModal(true)} className="gap-2">
                          <Camera className="w-4 h-4" /> 上传第一张作品
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="grid gap-6 md:grid-cols-2">
                      {data.photographyWorks.map((work) => (
                        <Card key={work.id} className="group cursor-pointer overflow-hidden border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 relative">
                          {editMode && (
                            <div className="absolute top-2 right-2 z-10 flex gap-1">
                              <Button
                                size="sm"
                                variant="secondary"
                                className="h-8 w-8 p-0 bg-background/80 backdrop-blur-sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingPhoto({ ...work });
                                }}
                              >
                                <Pencil className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                className="h-8 w-8 p-0"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeleteTarget({ type: 'photography', id: work.id });
                                }}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          )}
                          <div className="aspect-[3/2] overflow-hidden">
                            <img
                              src={work.image}
                              alt={work.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                          <CardContent className="p-5">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold group-hover:text-primary transition-colors">
                                {work.title}
                              </h3>
                              <Badge variant="outline" className="text-xs">
                                {work.category}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{work.description}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </section>

          {/* 关于我 */}
          <section id="about" className="py-20 px-6">
            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <h2 className="text-3xl font-bold">关于我</h2>
                    {editMode && !editingAbout && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-1"
                        onClick={() => {
                          setAboutForm(data.about);
                          setEditingAbout(true);
                        }}
                      >
                        <Pencil className="w-3 h-3" /> 编辑
                      </Button>
                    )}
                  </div>
                  
                  {editingAbout ? (
                    <div className="space-y-4">
                      {aboutForm.paragraphs.map((p, i) => (
                        <Textarea
                          key={i}
                          value={p}
                          onChange={(e) => {
                            const newParagraphs = [...aboutForm.paragraphs];
                            newParagraphs[i] = e.target.value;
                            setAboutForm(prev => ({ ...prev, paragraphs: newParagraphs }));
                          }}
                          placeholder={`段落 ${i + 1}`}
                          rows={3}
                        />
                      ))}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setAboutForm(prev => ({
                              ...prev,
                              paragraphs: [...prev.paragraphs, '']
                            }));
                          }}
                        >
                          + 添加段落
                        </Button>
                      </div>
                      <Input
                        value={aboutForm.tags.join(', ')}
                        onChange={(e) => setAboutForm(prev => ({ 
                          ...prev, 
                          tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                        }))}
                        placeholder="标签（用逗号分隔）"
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={saveAbout} className="gap-1">
                          <Check className="w-3 h-3" /> 保存
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingAbout(false)}>
                          <X className="w-3 h-3" /> 取消
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-4 text-muted-foreground">
                        {data.about.paragraphs.map((p, i) => (
                          <p key={i}>{p}</p>
                        ))}
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
          <section id="contact" className="py-20 px-6 bg-muted/30">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">保持联系</h2>
              <p className="text-muted-foreground mb-8">
                如果你想与我交流创作，或者有任何合作意向，欢迎联系我
              </p>
              <div className="flex justify-center gap-4">
                <Button variant="outline" size="lg" className="gap-2">
                  <Mail className="w-4 h-4" />
                  邮箱联系
                </Button>
                <Button variant="outline" size="lg" className="gap-2">
                  <Github className="w-4 h-4" />
                  GitHub
                </Button>
                <Button variant="outline" size="lg" className="gap-2">
                  <Twitter className="w-4 h-4" />
                  Twitter
                </Button>
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
        </>
      )}

      {/* 文章详情弹窗 */}
      <Dialog open={!!selectedWork} onOpenChange={() => setSelectedWork(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {selectedWork && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Badge variant="secondary">{selectedWork.category}</Badge>
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {selectedWork.date}
                  </span>
                </div>
                <DialogTitle className="text-2xl">{selectedWork.title}</DialogTitle>
              </DialogHeader>
              <div className="mt-4">
                <div className="prose prose-sm max-w-none">
                  {selectedWork.content.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="text-muted-foreground leading-relaxed mb-4 text-justify indent-8">
                      {paragraph}
                    </p>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-border text-right">
                  <p className="text-sm text-muted-foreground italic">
                    —— 平原竞海西渡
                  </p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* 上传作品弹窗 */}
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              添加新作品
            </DialogTitle>
            <DialogDescription>
              粘贴文章内容，添加到作品集
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">作品标题 *</label>
              <Input
                value={uploadForm.title}
                onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="输入作品标题"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">文章内容 *</label>
              <Textarea
                value={uploadForm.content}
                onChange={(e) => setUploadForm(prev => ({ ...prev, content: e.target.value }))}
                placeholder="粘贴文章内容..."
                rows={8}
                className="resize-none"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">分类</label>
                <Input
                  value={uploadForm.category}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, category: e.target.value }))}
                  placeholder="散文、随笔、诗歌..."
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">日期</label>
                <Input
                  value={uploadForm.date}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, date: e.target.value }))}
                  placeholder="2024年12月"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUploadModal(false)}>
              取消
            </Button>
            <Button onClick={handleUpload} disabled={isUploading} className="gap-2">
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  添加中...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  添加作品
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 摄影作品上传弹窗 */}
      <Dialog open={showPhotoUploadModal} onOpenChange={setShowPhotoUploadModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              添加摄影作品
            </DialogTitle>
            <DialogDescription>
              上传图片，添加到摄影作品集
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">选择图片 *</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <div 
                className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                {photoPreview ? (
                  <div className="relative">
                    <img 
                      src={photoPreview} 
                      alt="预览" 
                      className="max-h-48 mx-auto rounded-lg"
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute top-2 right-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPhotoFile(null);
                        setPhotoPreview('');
                      }}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="py-8">
                    <PhotoIcon className="w-12 h-12 mx-auto mb-2 text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground">点击选择图片</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">支持 JPG、PNG、GIF 等格式</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">作品标题 *</label>
              <Input
                value={photoForm.title}
                onChange={(e) => setPhotoForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="输入作品标题"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">作品描述</label>
              <Textarea
                value={photoForm.description}
                onChange={(e) => setPhotoForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="描述这张照片..."
                rows={2}
                className="resize-none"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">分类</label>
              <Input
                value={photoForm.category}
                onChange={(e) => setPhotoForm(prev => ({ ...prev, category: e.target.value }))}
                placeholder="风光、城市、人文..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowPhotoUploadModal(false);
              setPhotoFile(null);
              setPhotoPreview('');
              setPhotoForm({ title: '', description: '', category: '风光' });
            }}>
              取消
            </Button>
            <Button onClick={handlePhotoUpload} disabled={isUploadingPhoto} className="gap-2">
              {isUploadingPhoto ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  上传中...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  上传作品
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 密码验证弹窗 */}
      <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              管理验证
            </DialogTitle>
            <DialogDescription>
              请输入管理密码进入编辑模式
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <Input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError('');
                }}
                placeholder="请输入密码"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    enterEditMode();
                  }
                }}
              />
              {passwordError && (
                <p className="text-sm text-destructive mt-2">{passwordError}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowPasswordModal(false);
              setPassword('');
              setPasswordError('');
            }}>
              取消
            </Button>
            <Button onClick={enterEditMode}>
              确认
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 编辑文学作品弹窗 */}
      <Dialog open={!!editingWork} onOpenChange={() => setEditingWork(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>编辑文学作品</DialogTitle>
          </DialogHeader>
          
          {editingWork && (
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium mb-2 block">作品标题</label>
                <Input
                  value={editingWork.title}
                  onChange={(e) => setEditingWork(prev => prev ? { ...prev, title: e.target.value } : null)}
                  placeholder="输入作品标题"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">文章内容</label>
                <Textarea
                  value={editingWork.content}
                  onChange={(e) => setEditingWork(prev => prev ? { ...prev, content: e.target.value } : null)}
                  placeholder="文章内容..."
                  rows={10}
                  className="resize-none"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">分类</label>
                  <Input
                    value={editingWork.category}
                    onChange={(e) => setEditingWork(prev => prev ? { ...prev, category: e.target.value } : null)}
                    placeholder="散文、随笔、诗歌..."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">日期</label>
                  <Input
                    value={editingWork.date}
                    onChange={(e) => setEditingWork(prev => prev ? { ...prev, date: e.target.value } : null)}
                    placeholder="2024年12月"
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingWork(null)}>
              取消
            </Button>
            <Button onClick={handleUpdateWork} disabled={isSaving} className="gap-2">
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  保存中...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  保存
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 编辑摄影作品弹窗 */}
      <Dialog open={!!editingPhoto} onOpenChange={() => setEditingPhoto(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>编辑摄影作品</DialogTitle>
          </DialogHeader>
          
          {editingPhoto && (
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium mb-2 block">作品标题</label>
                <Input
                  value={editingPhoto.title}
                  onChange={(e) => setEditingPhoto(prev => prev ? { ...prev, title: e.target.value } : null)}
                  placeholder="输入作品标题"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">作品描述</label>
                <Textarea
                  value={editingPhoto.description}
                  onChange={(e) => setEditingPhoto(prev => prev ? { ...prev, description: e.target.value } : null)}
                  placeholder="描述这张照片..."
                  rows={2}
                  className="resize-none"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">分类</label>
                <Input
                  value={editingPhoto.category}
                  onChange={(e) => setEditingPhoto(prev => prev ? { ...prev, category: e.target.value } : null)}
                  placeholder="风光、城市、人文..."
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingPhoto(null)}>
              取消
            </Button>
            <Button onClick={handleUpdatePhoto} disabled={isSaving} className="gap-2">
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  保存中...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  保存
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 删除确认弹窗 */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              确认删除
            </DialogTitle>
            <DialogDescription>
              此操作不可撤销，确定要删除这个作品吗？
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              取消
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting} className="gap-2">
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  删除中...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  删除
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
