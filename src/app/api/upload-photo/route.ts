import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { readSiteData, writeSiteData } from '@/lib/kv-data';
import type { PhotographyWork } from '@/lib/kv-data';

export const config = {
  runtime: 'edge',
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string || '';
    const category = formData.get('category') as string || '风光';

    if (!file) {
      return NextResponse.json({ error: '请选择图片文件' }, { status: 400 });
    }

    if (!title) {
      return NextResponse.json({ error: '请输入作品标题' }, { status: 400 });
    }

    // 上传到 Vercel Blob
    const ext = file.name.split('.').pop() || 'jpg';
    const blobPath = `photography/${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`;
    
    const blob = await put(blobPath, file, {
      access: 'public',
      contentType: file.type || 'image/jpeg',
    });

    // 读取现有数据
    const data = await readSiteData();

    // 生成新ID
    const maxId = data.photographyWorks.reduce((max, work) => Math.max(max, work.id), 0);
    const newId = maxId + 1;

    // 创建新作品（Blob URL 是永久的，无需 imageKey）
    const newWork: PhotographyWork = {
      id: newId,
      title,
      description,
      category,
      image: blob.url,
    };

    data.photographyWorks.unshift(newWork);
    await writeSiteData(data);

    return NextResponse.json({
      success: true,
      work: newWork,
      message: '摄影作品添加成功！',
    });
  } catch (error) {
    console.error('Upload photo error:', error);
    return NextResponse.json({ error: '上传失败，请重试' }, { status: 500 });
  }
}
