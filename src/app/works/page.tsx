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
  BookOpen,
  ChevronRight,
  Calendar,
  Pencil,
  Plus,
  Upload,
  Loader2,
  Settings,
  X,
  Check,
  Trash2,
  AlertTriangle,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';

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

export default function WorksPage() {
  const [activeTab, setActiveTab] = useState<'literature' | 'photography'>('literature');
  const [selectedWork, setSelectedWork] = useState<LiteraryWork | null>(null);
  const [data, setData] = useState<{ literaryWorks: LiteraryWork[]; photographyWorks: PhotographyWork[] }>({
    literaryWorks: [],
    photographyWorks: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  // 编辑状态
  const [editMode, setEditMode] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showPhotoUploadModal, setShowPhotoUploadModal] = useState(false);

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
        setData({
          literaryWorks: resData.literaryWorks || [],
          photographyWorks: resData.photographyWorks || [],
        });
      })
      .catch(() => {
        setData({ literaryWorks: [], photographyWorks: [] });
      })
      .finally(() => setIsLoading(false));
  }, []);

  // 检查管理状态
  useEffect(() => {
    if (sessionStorage.getItem('adminAuth') === 'true') {
      setEditMode(true);
    }
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

  const reloadData = async () => {
    const res = await fetch('/api/site-data');
    const newData = await res.json();
    setData({
      literaryWorks: newData.literaryWorks || [],
      photographyWorks: newData.photographyWorks || [],
    });
  };

  // 上传文学作品
  const handleUpload = async () => {
    if (!uploadForm.title.trim()) { alert('请输入作品标题'); return; }
    if (!uploadForm.content.trim()) { alert('请输入文章内容'); return; }
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
        setUploadForm({ title: '', content: '', category: '散文', date: new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' }) });
      } else { alert(resData.error || '上传失败'); }
    } catch { alert('上传失败，请重试'); }
    finally { setIsUploading(false); }
  };

  // 选择图片
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) { alert('请选择图片文件'); return; }
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onload = (event) => { setPhotoPreview(event.target?.result as string); };
      reader.readAsDataURL(file);
    }
  };

  // 上传摄影作品（Edge Runtime，支持最大 128MB）
  const handlePhotoUpload = async () => {
    if (!photoForm.title.trim()) { alert('请输入作品标题'); return; }
    if (!photoFile) { alert('请选择图片文件'); return; }
    setIsUploadingPhoto(true);
    try {
      const formData = new FormData();
      formData.append('file', photoFile);
      formData.append('title', photoForm.title);
      formData.append('description', photoForm.description);
      formData.append('category', photoForm.category);
      const res = await fetch('/api/upload-photo', { method: 'POST', body: formData });
      const resData = await res.json();
      if (resData.success) {
        reloadData();
        setShowPhotoUploadModal(false);
        setPhotoForm({ title: '', description: '', category: '风光' });
        setPhotoFile(null); setPhotoPreview('');
      } else { alert(resData.error || '上传失败'); }
    } catch { alert('上传失败，请重试'); }
    finally { setIsUploadingPhoto(false); }
  };

  // 删除作品
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/work?type=${deleteTarget.type}&id=${deleteTarget.id}`, { method: 'DELETE' });
      const resData = await res.json();
      if (resData.success) { reloadData(); setDeleteTarget(null); }
      else { alert(resData.error || '删除失败'); }
    } catch { alert('删除失败，请重试'); }
    finally { setIsDeleting(false); }
  };

  // 更新文学作品
  const handleUpdateWork = async () => {
    if (!editingWork) return;
    if (!editingWork.title.trim()) { alert('请输入作品标题'); return; }
    if (!editingWork.content.trim()) { alert('请输入文章内容'); return; }
    setIsSaving(true);
    try {
      const res = await fetch('/api/work', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'literary', id: editingWork.id, data: { title: editingWork.title, content: editingWork.content, category: editingWork.category, date: editingWork.date } }),
      });
      const resData = await res.json();
      if (resData.success) { reloadData(); setEditingWork(null); }
      else { alert(resData.error || '更新失败'); }
    } catch { alert('更新失败，请重试'); }
    finally { setIsSaving(false); }
  };

  // 更新摄影作品
  const handleUpdatePhoto = async () => {
    if (!editingPhoto) return;
    if (!editingPhoto.title.trim()) { alert('请输入作品标题'); return; }
    setIsSaving(true);
    try {
      const res = await fetch('/api/work', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'photography', id: editingPhoto.id, data: { title: editingPhoto.title, description: editingPhoto.description, category: editingPhoto.category } }),
      });
      const resData = await res.json();
      if (resData.success) { reloadData(); setEditingPhoto(null); }
      else { alert(resData.error || '更新失败'); }
    } catch { alert('更新失败，请重试'); }
    finally { setIsSaving(false); }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* 导航栏 */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">返回首页</span>
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="font-medium text-lg">作品集</span>
          </div>
          <Button variant={editMode ? "default" : "outline"} size="sm" className="gap-1" onClick={handleManageClick}>
            <Settings className="w-3 h-3" />{editMode ? '完成' : '管理'}
          </Button>
        </div>
      </nav>

      <main className="pt-24 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">作品集</h2>
            <p className="text-muted-foreground">文学与摄影，是我观察世界的两种方式</p>
          </div>

          {/* 标签切换 */}
          <div className="flex justify-center items-center gap-4 mb-10">
            <div className="flex gap-2">
              <Button variant={activeTab === 'literature' ? 'default' : 'outline'} className="gap-2" onClick={() => setActiveTab('literature')}>
                <BookOpen className="w-4 h-4" />文学作品
                {data.literaryWorks.length > 0 && <Badge variant="secondary" className="ml-1">{data.literaryWorks.length}</Badge>}
              </Button>
              <Button variant={activeTab === 'photography' ? 'default' : 'outline'} className="gap-2" onClick={() => setActiveTab('photography')}>
                <Camera className="w-4 h-4" />摄影作品
                {data.photographyWorks.length > 0 && <Badge variant="secondary" className="ml-1">{data.photographyWorks.length}</Badge>}
              </Button>
            </div>
            {editMode && (
              <Button size="sm" className="gap-1" onClick={() => activeTab === 'literature' ? setShowUploadModal(true) : setShowPhotoUploadModal(true)}>
                <Plus className="w-3 h-3" /> 添加作品
              </Button>
            )}
          </div>

          {/* 文学作品 */}
          {activeTab === 'literature' && (
            data.literaryWorks.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                <p className="text-muted-foreground mb-4">暂无文学作品</p>
                {editMode && <Button onClick={() => setShowUploadModal(true)} className="gap-2"><Upload className="w-4 h-4" /> 上传第一篇作品</Button>}
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {data.literaryWorks.map((work) => (
                  <Card key={work.id} className="group cursor-pointer border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 relative" onClick={() => !editMode && setSelectedWork(work)}>
                    {editMode && (
                      <div className="absolute top-2 right-2 z-10 flex gap-1">
                        <Button size="sm" variant="secondary" className="h-8 w-8 p-0" onClick={(e) => { e.stopPropagation(); setEditingWork({ ...work }); }}><Pencil className="w-3 h-3" /></Button>
                        <Button size="sm" variant="destructive" className="h-8 w-8 p-0" onClick={(e) => { e.stopPropagation(); setDeleteTarget({ type: 'literary', id: work.id }); }}><Trash2 className="w-3 h-3" /></Button>
                      </div>
                    )}
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-3"><Badge variant="secondary">{work.category}</Badge><span className="text-xs text-muted-foreground">{work.date}</span></div>
                      <h3 className="font-semibold text-lg mb-3 group-hover:text-primary transition-colors">{work.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{work.excerpt}</p>
                      <div className="mt-4 flex items-center text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">阅读全文<ChevronRight className="w-4 h-4 ml-1" /></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )
          )}

          {/* 摄影作品 */}
          {activeTab === 'photography' && (
            data.photographyWorks.length === 0 ? (
              <div className="text-center py-12">
                <Camera className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                <p className="text-muted-foreground mb-4">暂无摄影作品</p>
                {editMode && <Button onClick={() => setShowPhotoUploadModal(true)} className="gap-2"><Camera className="w-4 h-4" /> 上传第一张作品</Button>}
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {data.photographyWorks.map((work) => (
                  <Card key={work.id} className="group cursor-pointer overflow-hidden border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 relative">
                    {editMode && (
                      <div className="absolute top-2 right-2 z-10 flex gap-1">
                        <Button size="sm" variant="secondary" className="h-8 w-8 p-0 bg-background/80 backdrop-blur-sm" onClick={(e) => { e.stopPropagation(); setEditingPhoto({ ...work }); }}><Pencil className="w-3 h-3" /></Button>
                        <Button size="sm" variant="destructive" className="h-8 w-8 p-0" onClick={(e) => { e.stopPropagation(); setDeleteTarget({ type: 'photography', id: work.id }); }}><Trash2 className="w-3 h-3" /></Button>
                      </div>
                    )}
                    <div className="aspect-[3/2] overflow-hidden"><img src={work.image} alt={work.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /></div>
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between mb-2"><h3 className="font-semibold group-hover:text-primary transition-colors">{work.title}</h3><Badge variant="outline" className="text-xs">{work.category}</Badge></div>
                      <p className="text-sm text-muted-foreground">{work.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )
          )}
        </div>
      </main>

      {/* ===== 以下为弹窗 ===== */}

      {/* 文章详情 */}
      <Dialog open={!!selectedWork} onOpenChange={() => setSelectedWork(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {selectedWork && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3 mb-2"><Badge variant="secondary">{selectedWork.category}</Badge><span className="text-sm text-muted-foreground flex items-center gap-1"><Calendar className="w-3 h-3" />{selectedWork.date}</span></div>
                <DialogTitle className="text-2xl">{selectedWork.title}</DialogTitle>
              </DialogHeader>
              <div className="mt-4">
                <div className="prose prose-sm max-w-none">
                  {selectedWork.content.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="text-muted-foreground leading-relaxed mb-4 text-justify indent-8">{paragraph}</p>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-border text-right"><p className="text-sm text-muted-foreground italic">—— 平原竞海西渡</p></div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* 上传文学作品弹窗 */}
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><Plus className="w-5 h-5" />添加新作品</DialogTitle><DialogDescription>粘贴文章内容，添加到作品集</DialogDescription></DialogHeader>
          <div className="space-y-4 py-4">
            <div><label className="text-sm font-medium mb-2 block">作品标题 *</label><Input value={uploadForm.title} onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))} placeholder="输入作品标题" /></div>
            <div><label className="text-sm font-medium mb-2 block">文章内容 *</label><Textarea value={uploadForm.content} onChange={(e) => setUploadForm(prev => ({ ...prev, content: e.target.value }))} placeholder="粘贴文章内容..." rows={8} className="resize-none" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-sm font-medium mb-2 block">分类</label><Input value={uploadForm.category} onChange={(e) => setUploadForm(prev => ({ ...prev, category: e.target.value }))} placeholder="散文、随笔、诗歌..." /></div>
              <div><label className="text-sm font-medium mb-2 block">日期</label><Input value={uploadForm.date} onChange={(e) => setUploadForm(prev => ({ ...prev, date: e.target.value }))} placeholder="2024年12月" /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUploadModal(false)}>取消</Button>
            <Button onClick={handleUpload} disabled={isUploading} className="gap-2">{isUploading ? <><Loader2 className="w-4 h-4 animate-spin" />添加中...</> : <><Plus className="w-4 h-4" />添加作品</>}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 摄影上传弹窗 */}
      <Dialog open={showPhotoUploadModal} onOpenChange={setShowPhotoUploadModal}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><Camera className="w-5 h-5" />添加摄影作品</DialogTitle><DialogDescription>上传图片，添加到摄影作品集</DialogDescription></DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">选择图片 *</label>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
              <div className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-primary/50 transition-colors" onClick={() => fileInputRef.current?.click()}>
                {photoPreview ? (
                  <div className="relative"><img src={photoPreview} alt="预览" className="max-h-48 mx-auto rounded-lg" />
                    <Button size="sm" variant="destructive" className="absolute top-2 right-2" onClick={(e) => { e.stopPropagation(); setPhotoFile(null); setPhotoPreview(''); }}><X className="w-3 h-3" /></Button>
                  </div>
                ) : (
                  <div className="py-8"><Upload className="w-12 h-12 mx-auto mb-2 text-muted-foreground/50" /><p className="text-sm text-muted-foreground">点击选择图片</p></div>
                )}
              </div>
            </div>
            <div><label className="text-sm font-medium mb-2 block">作品标题 *</label><Input value={photoForm.title} onChange={(e) => setPhotoForm(prev => ({ ...prev, title: e.target.value }))} placeholder="输入作品标题" /></div>
            <div><label className="text-sm font-medium mb-2 block">作品描述</label><Textarea value={photoForm.description} onChange={(e) => setPhotoForm(prev => ({ ...prev, description: e.target.value }))} placeholder="描述这张照片..." rows={2} className="resize-none" /></div>
            <div><label className="text-sm font-medium mb-2 block">分类</label><Input value={photoForm.category} onChange={(e) => setPhotoForm(prev => ({ ...prev, category: e.target.value }))} placeholder="风光、城市、人文..." /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowPhotoUploadModal(false); setPhotoFile(null); setPhotoPreview(''); setPhotoForm({ title: '', description: '', category: '风光' }); }}>取消</Button>
            <Button onClick={handlePhotoUpload} disabled={isUploadingPhoto} className="gap-2">{isUploadingPhoto ? <><Loader2 className="w-4 h-4 animate-spin" />上传中...</> : <><Upload className="w-4 h-4" />上传作品</>}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 密码弹窗 */}
      <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><Settings className="w-5 h-5" />管理验证</DialogTitle><DialogDescription>请输入管理密码进入编辑模式</DialogDescription></DialogHeader>
          <div className="space-y-4 py-4">
            <Input type="password" value={password} onChange={(e) => { setPassword(e.target.value); setPasswordError(''); }} placeholder="请输入密码" onKeyDown={(e) => { if (e.key === 'Enter') enterEditMode(); }} />
            {passwordError && <p className="text-sm text-destructive mt-2">{passwordError}</p>}
          </div>
          <DialogFooter><Button variant="outline" onClick={() => { setShowPasswordModal(false); setPassword(''); setPasswordError(''); }}>取消</Button><Button onClick={enterEditMode}>确认</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 编辑文学作品 */}
      <Dialog open={!!editingWork} onOpenChange={() => setEditingWork(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>编辑文学作品</DialogTitle></DialogHeader>
          {editingWork && (
            <div className="space-y-4 py-4">
              <div><label className="text-sm font-medium mb-2 block">作品标题</label><Input value={editingWork.title} onChange={(e) => setEditingWork(prev => prev ? { ...prev, title: e.target.value } : null)} placeholder="输入作品标题" /></div>
              <div><label className="text-sm font-medium mb-2 block">文章内容</label><Textarea value={editingWork.content} onChange={(e) => setEditingWork(prev => prev ? { ...prev, content: e.target.value } : null)} placeholder="文章内容..." rows={10} className="resize-none" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm font-medium mb-2 block">分类</label><Input value={editingWork.category} onChange={(e) => setEditingWork(prev => prev ? { ...prev, category: e.target.value } : null)} placeholder="散文、随笔、诗歌..." /></div>
                <div><label className="text-sm font-medium mb-2 block">日期</label><Input value={editingWork.date} onChange={(e) => setEditingWork(prev => prev ? { ...prev, date: e.target.value } : null)} placeholder="2024年12月" /></div>
              </div>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setEditingWork(null)}>取消</Button><Button onClick={handleUpdateWork} disabled={isSaving} className="gap-2">{isSaving ? <><Loader2 className="w-4 h-4 animate-spin" />保存中...</> : <><Check className="w-4 h-4" />保存</>}</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 编辑摄影作品 */}
      <Dialog open={!!editingPhoto} onOpenChange={() => setEditingPhoto(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>编辑摄影作品</DialogTitle></DialogHeader>
          {editingPhoto && (
            <div className="space-y-4 py-4">
              <div><label className="text-sm font-medium mb-2 block">作品标题</label><Input value={editingPhoto.title} onChange={(e) => setEditingPhoto(prev => prev ? { ...prev, title: e.target.value } : null)} placeholder="输入作品标题" /></div>
              <div><label className="text-sm font-medium mb-2 block">作品描述</label><Textarea value={editingPhoto.description} onChange={(e) => setEditingPhoto(prev => prev ? { ...prev, description: e.target.value } : null)} placeholder="描述这张照片..." rows={2} className="resize-none" /></div>
              <div><label className="text-sm font-medium mb-2 block">分类</label><Input value={editingPhoto.category} onChange={(e) => setEditingPhoto(prev => prev ? { ...prev, category: e.target.value } : null)} placeholder="风光、城市、人文..." /></div>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setEditingPhoto(null)}>取消</Button><Button onClick={handleUpdatePhoto} disabled={isSaving} className="gap-2">{isSaving ? <><Loader2 className="w-4 h-4 animate-spin" />保存中...</> : <><Check className="w-4 h-4" />保存</>}</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 删除确认 */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle className="flex items-center gap-2 text-destructive"><AlertTriangle className="w-5 h-5" />确认删除</DialogTitle><DialogDescription>此操作不可撤销，确定要删除这个作品吗？</DialogDescription></DialogHeader>
          <DialogFooter><Button variant="outline" onClick={() => setDeleteTarget(null)}>取消</Button><Button variant="destructive" onClick={handleDelete} disabled={isDeleting} className="gap-2">{isDeleting ? <><Loader2 className="w-4 h-4 animate-spin" />删除中...</> : <><Trash2 className="w-4 h-4" />删除</>}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
