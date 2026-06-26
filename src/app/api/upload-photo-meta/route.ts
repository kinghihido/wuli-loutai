import { NextRequest, NextResponse } from 'next/server';
import { readSiteData, writeSiteData } from '@/lib/kv-data';
import type { PhotographyWork } from '@/lib/kv-data';

/**
 * POST /api/upload-photo-meta
 * 客户端直传 Blob 成功后，保存作品元数据到 KV
 * Body: { imageUrl, title, description, category }
 */
export async function POST(request: NextRequest) {
  try {
    const { imageUrl, title, description, category } = await request.json();

    if (!imageUrl || !title) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      );
    }

    const data = await readSiteData();
    const maxId = data.photographyWorks.reduce(
      (max, work) => Math.max(max, work.id),
      0
    );
    const newId = maxId + 1;

    const newWork: PhotographyWork = {
      id: newId,
      title,
      description: description || '',
      category: category || '风光',
      image: imageUrl,
    };

    data.photographyWorks.unshift(newWork);
    await writeSiteData(data);

    return NextResponse.json({
      success: true,
      work: newWork,
      message: '摄影作品添加成功！',
    });
  } catch (error) {
    console.error('Save photo meta error:', error);
    return NextResponse.json(
      { error: '保存失败，请重试' },
      { status: 500 }
    );
  }
}
