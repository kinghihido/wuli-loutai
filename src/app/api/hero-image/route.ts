import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { del } from '@vercel/blob';

// 支持的图片格式
const SUPPORTED_TYPES = [
  'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
  'image/bmp', 'image/tiff', 'image/svg+xml', 'image/heic', 'image/heif',
];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: '请选择图片文件' }, { status: 400 });
    }

    // 验证文件类型
    const mimeType = file.type.toLowerCase();
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'tiff', 'tif', 'svg', 'heic', 'heif'];
    
    if (!SUPPORTED_TYPES.includes(mimeType) && !imageExts.includes(ext)) {
      return NextResponse.json({ 
        error: `不支持的图片格式。支持格式：${imageExts.join(', ')}` 
      }, { status: 400 });
    }

    // Vercel Blob 最大支持约 500MB，但函数体限制 4.5MB
    // 对于大文件，建议前端压缩后再上传
    const MAX_FILE_SIZE = 4.5 * 1024 * 1024; // 4.5MB（Vercel 函数体限制）
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ 
        error: `图片文件过大（${(file.size / 1024 / 1024).toFixed(1)}MB），Vercel 函数体限制 4.5MB。请压缩图片后重试。` 
      }, { status: 400 });
    }

    // 上传到 Vercel Blob
    const storageExt = ext === 'jpeg' ? 'jpg' : ext;
    const blobPath = `hero/${Date.now()}_${Math.random().toString(36).substring(7)}.${storageExt}`;
    
    const blob = await put(blobPath, file, {
      access: 'public',
      contentType: mimeType || 'image/jpeg',
    });

    return NextResponse.json({
      success: true,
      imageUrl: blob.url,
      message: '图片上传成功！',
    });
  } catch (error) {
    console.error('Upload hero image error:', error);
    return NextResponse.json({ error: '上传失败，请重试' }, { status: 500 });
  }
}

// DELETE - 删除 hero 图片
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');
    
    if (!url) {
      return NextResponse.json({ error: '缺少图片 URL' }, { status: 400 });
    }

    // 从 Vercel Blob 删除
    await del(url);

    return NextResponse.json({ success: true, message: '图片已删除' });
  } catch (error) {
    console.error('Delete hero image error:', error);
    return NextResponse.json({ error: '删除失败' }, { status: 500 });
  }
}
