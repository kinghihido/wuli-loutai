import { NextRequest, NextResponse } from 'next/server';
import { del } from '@vercel/blob';
import { readSiteData, writeSiteData } from '@/lib/kv-data';
import type { SiteData } from '@/lib/kv-data';

// GET - 获取数据
export async function GET() {
  const data = await readSiteData();
  return NextResponse.json(data);
}

// POST - 更新数据（合并更新）
// 特殊处理 heroImages：如果图片被删除，同时从 Blob 删除对应文件
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const current = await readSiteData();

    // 处理 heroImages 变更：清理被删除的 Blob 文件
    if (body.heroImages !== undefined) {
      const currentUrls = new Set(
        (current.heroImages || []).map((img: { url: string }) => img.url).filter(Boolean)
      );
      const newUrls = new Set(
        (body.heroImages || []).map((img: { url: string }) => img.url).filter(Boolean)
      );

      // 找出被删除的图片 URL
      for (const url of currentUrls) {
        if (!newUrls.has(url) && url.includes('blob.vercel-storage.com')) {
          try {
            await del(url);
            console.log('Deleted blob:', url);
          } catch (e) {
            console.error('Failed to delete blob:', url, e);
          }
        }
      }
    }

    // 合并更新
    const merged = { ...current, ...body };
    await writeSiteData(merged);

    return NextResponse.json({ success: true, data: merged });
  } catch (error) {
    console.error('Save data error:', error);
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
  }
}
