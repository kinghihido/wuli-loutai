'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Plus,
  Trash2,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Upload,
  Pencil,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { put, del as blobDel } from '@vercel/blob/client';

interface HeroImage {
  id: string;
  url: string;
}

interface HeroCarouselProps {
  images: HeroImage[];
  onChange: (images: HeroImage[]) => void;
  editMode?: boolean;
  title?: string;
  subtitle?: string;
  description?: string;
}

export function HeroCarousel({ images, onChange, editMode, title, subtitle, description }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 自动轮播
  useEffect(() => {
    if (images.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [images.length]);

  // 确保currentIndex不越界
  useEffect(() => {
    if (images.length > 0 && currentIndex >= images.length) {
      setCurrentIndex(0);
    }
  }, [images.length, currentIndex]);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadError('');
    
    // 验证文件类型
    const validExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'tiff', 'tif', 'svg', 'heic', 'heif'];
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    const isValidType = file.type.startsWith('image/') || validExts.includes(ext);
    
    if (!isValidType) {
      setUploadError('不支持的图片格式');
      return;
    }
    
    setIsUploading(true);
    try {
      // 客户端直传 Vercel Blob，绕过 Function 4.5MB 限制
      const pathname = `hero/${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`;
      const blob = await put(pathname, file, {
        access: 'public',
        handleUploadUrl: '/api/blob-upload',
        contentType: file.type || 'image/jpeg',
      });

      const newImage: HeroImage = {
        id: `hero-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        url: blob.url,
      };
      onChange([...images, newImage]);
      setShowUploadModal(false);
      setCurrentIndex(images.length);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError('上传失败，请重试');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [images, onChange]);

  const handleDelete = useCallback(async (id: string) => {
    const image = images.find(img => img.id === id);
    if (!image) return;

    // 尝试从 Blob 存储中删除（失败也不阻塞 UI）
    try {
      await blobDel(image.url);
    } catch (e) {
      console.warn('Blob delete failed, skipping:', e);
    }

    const newImages = images.filter(img => img.id !== id);
    onChange(newImages);
    if (currentIndex >= newImages.length) {
      setCurrentIndex(Math.max(0, newImages.length - 1));
    }
  }, [images, onChange, currentIndex]);

  const goToPrev = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (images.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const goToNext = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (images.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  // 空状态 - 没有图片时
  if (images.length === 0) {
    return (
      <div className="relative w-full h-[60vh] md:h-[70vh] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        {/* 装饰背景 */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        </div>

        {/* 文字内容 */}
        <div className="relative z-10 text-center px-6">
          {(title || subtitle) && (
            <div className="mb-8">
              {title && (
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg tracking-wide">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="text-xl md:text-2xl text-white/80 mb-4 drop-shadow-md">
                  {subtitle}
                </p>
              )}
              {description && (
                <p className="text-base text-white/60 max-w-lg mx-auto drop-shadow-md line-clamp-3">
                  {description}
                </p>
              )}
            </div>
          )}
          
          {editMode ? (
            <Button
              size="lg"
              className="gap-2 bg-white/20 hover:bg-white/30 text-white border border-white/30"
              onClick={() => setShowUploadModal(true)}
            >
              <Upload className="w-5 h-5" />
              上传封面图片
            </Button>
          ) : (
            <div className="flex items-center gap-2 text-white/40">
              <ImageIcon className="w-5 h-5" />
              <span>暂无封面图片</span>
            </div>
          )}
        </div>

        {/* 上传弹窗 */}
        <Dialog open={showUploadModal} onOpenChange={(open) => { setShowUploadModal(open); if (!open) setUploadError(''); }}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>上传封面图片</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                ref={fileInputRef}
              />
              <div
                className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-12 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/10 transition-all"
                onClick={() => fileInputRef.current?.click()}
              >
                {isUploading ? (
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-3" />
                    <p className="text-muted-foreground font-medium">上传中...</p>
                  </div>
                ) : (
                  <>
                    <Upload className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-muted-foreground mb-1 font-medium">点击选择图片</p>
                    <p className="text-xs text-muted-foreground/60">支持 JPG, PNG, GIF, WebP, BMP, TIFF, SVG, HEIC 格式</p>
                  </>
                )}
              </div>
              {uploadError && (
                <p className="mt-3 text-sm text-destructive text-center">{uploadError}</p>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setShowUploadModal(false); setUploadError(''); }}>
                取消
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // 有图片时 - 轮播显示
  const currentImage = images[currentIndex] || images[0];

  return (
    <>
      <div className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden group">
        {/* 图片 */}
        <img
          key={currentImage.id}
          src={currentImage.url}
          alt={`封面 ${currentIndex + 1}`}
          className="w-full h-full object-cover"
        />
        
        {/* 渐变遮罩 */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* 文字叠加 */}
        <div className="absolute inset-0 flex items-center">
          <div className="px-8 md:px-16 max-w-2xl">
            {title && (
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg tracking-wide leading-tight">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-xl md:text-2xl text-white/90 mb-4 drop-shadow-md font-light">
                {subtitle}
              </p>
            )}
            {description && (
              <p className="text-base md:text-lg text-white/70 max-w-lg drop-shadow-md line-clamp-3">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* 管理按钮 */}
        {editMode && (
          <div className="absolute top-4 right-4 flex gap-2 z-20">
            <Button
              size="sm"
              variant="secondary"
              className="gap-1 bg-white/90 hover:bg-white shadow-md"
              onClick={() => setShowEditModal(true)}
            >
              <ImageIcon className="w-4 h-4" />
              管理图片
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="gap-1 bg-white/90 hover:bg-white shadow-md"
              onClick={() => setShowUploadModal(true)}
            >
              <Plus className="w-4 h-4" />
              添加
            </Button>
          </div>
        )}

        {/* 左右箭头 */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/30 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/50 z-10 backdrop-blur-sm"
              aria-label="上一张"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/30 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/50 z-10 backdrop-blur-sm"
              aria-label="下一张"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* 底部指示器 */}
        {images.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  'h-2 rounded-full transition-all duration-300',
                  index === currentIndex 
                    ? 'bg-white w-8' 
                    : 'bg-white/40 hover:bg-white/60 w-2'
                )}
                aria-label={`切换到第 ${index + 1} 张图片`}
              />
            ))}
          </div>
        )}

        {/* 计数器 */}
        {images.length > 1 && (
          <div className="absolute bottom-6 right-6 px-3 py-1.5 rounded-full bg-black/40 text-white text-sm z-10 backdrop-blur-sm">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* 管理图片弹窗 */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>管理封面图片 ({images.length})</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-3 max-h-96 overflow-y-auto">
            {images.map((image, index) => (
              <div key={image.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <img 
                  src={image.url} 
                  alt="" 
                  className="w-24 h-16 object-cover rounded-md border" 
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">图片 {index + 1}</p>
                  <p className="text-xs text-muted-foreground truncate">{image.id}</p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"
                  onClick={() => handleDelete(image.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              关闭
            </Button>
            <Button 
              onClick={() => { setShowEditModal(false); setShowUploadModal(true); }} 
              className="gap-1"
            >
              <Plus className="w-4 h-4" />
              添加图片
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 上传弹窗 */}
      <Dialog open={showUploadModal} onOpenChange={(open) => { setShowUploadModal(open); if (!open) setUploadError(''); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>上传封面图片</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              ref={fileInputRef}
            />
            <div
              className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-12 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/10 transition-all"
              onClick={() => fileInputRef.current?.click()}
            >
              {isUploading ? (
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-3" />
                  <p className="text-muted-foreground font-medium">上传中...</p>
                </div>
              ) : (
                <>
                  <Upload className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-muted-foreground mb-1 font-medium">点击选择图片</p>
                  <p className="text-xs text-muted-foreground/60">支持 JPG, PNG, GIF, WebP, BMP, TIFF, SVG, HEIC 格式</p>
                </>
              )}
            </div>
            {uploadError && (
              <p className="mt-3 text-sm text-destructive text-center">{uploadError}</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowUploadModal(false); setUploadError(''); }}>
              取消
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default HeroCarousel;
