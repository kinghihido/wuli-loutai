import { NextRequest, NextResponse } from 'next/server';
import { del } from '@vercel/blob';
import { readSiteData, writeSiteData } from '@/lib/kv-data';

// DELETE - 删除作品
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'literary' or 'photography'
    const id = parseInt(searchParams.get('id') || '0');

    if (!type || !id) {
      return NextResponse.json({ error: '缺少参数' }, { status: 400 });
    }

    const data = await readSiteData();

    if (type === 'literary') {
      data.literaryWorks = data.literaryWorks.filter(w => w.id !== id);
    } else if (type === 'photography') {
      // 删除摄影作品时，同时从 Blob 删除图片
      const workToDelete = data.photographyWorks.find(w => w.id === id);
      if (workToDelete?.image) {
        try {
          await del(workToDelete.image);
        } catch (e) {
          console.error('Failed to delete blob:', e);
          // 不阻断主流程，即使 Blob 删除失败也继续删除记录
        }
      }
      data.photographyWorks = data.photographyWorks.filter(w => w.id !== id);
    }

    await writeSiteData(data);
    return NextResponse.json({ success: true, message: '删除成功' });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: '删除失败' }, { status: 500 });
  }
}

// PUT - 更新作品
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, id, data: workData } = body;

    if (!type || !id || !workData) {
      return NextResponse.json({ error: '缺少参数' }, { status: 400 });
    }

    const data = await readSiteData();

    if (type === 'literary') {
      const index = data.literaryWorks.findIndex(w => w.id === id);
      if (index !== -1) {
        const excerpt = workData.content?.replace(/\n+/g, ' ').substring(0, 100) + '...' || data.literaryWorks[index].excerpt;
        data.literaryWorks[index] = { ...data.literaryWorks[index], ...workData, excerpt };
      }
    } else if (type === 'photography') {
      const index = data.photographyWorks.findIndex(w => w.id === id);
      if (index !== -1) {
        data.photographyWorks[index] = { ...data.photographyWorks[index], ...workData };
      }
    }

    await writeSiteData(data);
    return NextResponse.json({ success: true, message: '更新成功' });
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json({ error: '更新失败' }, { status: 500 });
  }
}
