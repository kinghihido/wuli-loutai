import { NextRequest, NextResponse } from 'next/server';
import { readSiteData, writeSiteData } from '@/lib/kv-data';
import type { LiteraryWork, SiteData } from '@/lib/kv-data';

export async function POST(request: NextRequest) {
  try {
    const { title, content, category, date } = await request.json();
    
    if (!content || !content.trim()) {
      return NextResponse.json({ error: '请输入文章内容' }, { status: 400 });
    }

    if (!title || !title.trim()) {
      return NextResponse.json({ error: '请输入作品标题' }, { status: 400 });
    }

    const textContent = content.trim();
    const excerpt = textContent.replace(/\n+/g, ' ').substring(0, 100) + '...';

    const data = await readSiteData();
    const maxId = data.literaryWorks.reduce((max, work) => Math.max(max, work.id), 0);
    const newId = maxId + 1;

    const newWork: LiteraryWork = {
      id: newId,
      title: title.trim(),
      excerpt,
      category: category || '散文',
      date: date || new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' }),
      content: textContent,
    };

    data.literaryWorks.unshift(newWork);
    await writeSiteData(data);

    return NextResponse.json({ 
      success: true, 
      work: newWork,
      message: '作品添加成功！' 
    });
  } catch (error) {
    console.error('Upload work error:', error);
    return NextResponse.json({ error: '上传失败，请重试' }, { status: 500 });
  }
}
