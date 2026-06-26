import { NextRequest, NextResponse } from 'next/server';
import { readSiteData, writeSiteData } from '@/lib/kv-data';
import type { HeroImage } from '@/lib/kv-data';

/**
 * POST /api/hero-image-meta
 * 客户端直传 Blob 成功后，保存 hero image URL 到 KV
 * Body: { imageUrl }
 */
export async function POST(request: NextRequest) {
  try {
    const { imageUrl } = await request.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: '缺少 imageUrl' },
        { status: 400 }
      );
    }

    const data = await readSiteData();

    // 如果已有 3 张，替换最旧的一张（FIFO）
    const newImage: HeroImage = {
      id: `hero-${Date.now()}`,
      url: imageUrl,
    };

    data.heroImages.unshift(newImage);
    if (data.heroImages.length > 3) {
      data.heroImages = data.heroImages.slice(0, 3);
    }

    await writeSiteData(data);

    return NextResponse.json({
      success: true,
      images: data.heroImages,
      message: '封面图片已保存！',
    });
  } catch (error) {
    console.error('Save hero image meta error:', error);
    return NextResponse.json(
      { error: '保存失败，请重试' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/hero-image-meta?url=...
 * 从 KV 删除指定的 hero image
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json(
        { error: '缺少图片 URL' },
        { status: 400 }
      );
    }

    const data = await readSiteData();
    data.heroImages = data.heroImages.filter((img) => img.url !== url);
    await writeSiteData(data);

    return NextResponse.json({
      success: true,
      images: data.heroImages,
      message: '图片已删除',
    });
  } catch (error) {
    console.error('Delete hero image meta error:', error);
    return NextResponse.json(
      { error: '删除失败' },
      { status: 500 }
    );
  }
}
