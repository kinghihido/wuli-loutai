import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.env.COZE_WORKSPACE_PATH || '/workspace/projects', 'data', 'site-data.json');

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
  imageKey?: string;
}

interface SiteData {
  hero: { title: string; subtitle: string; description: string };
  about: { paragraphs: string[]; tags: string[] };
  literaryWorks: LiteraryWork[];
  photographyWorks: PhotographyWork[];
}

function readData(): SiteData {
  const dataDir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    return {
      hero: { title: '', subtitle: '', description: '' },
      about: { paragraphs: [], tags: [] },
      literaryWorks: [],
      photographyWorks: [],
    };
  }
  try {
    const content = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(content);
  } catch {
    return {
      hero: { title: '', subtitle: '', description: '' },
      about: { paragraphs: [], tags: [] },
      literaryWorks: [],
      photographyWorks: [],
    };
  }
}

function writeData(data: SiteData) {
  const dataDir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// DELETE - 删除作品
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'literary' or 'photography'
    const id = parseInt(searchParams.get('id') || '0');

    if (!type || !id) {
      return NextResponse.json({ error: '缺少参数' }, { status: 400 });
    }

    const data = readData();

    if (type === 'literary') {
      data.literaryWorks = data.literaryWorks.filter(w => w.id !== id);
    } else if (type === 'photography') {
      data.photographyWorks = data.photographyWorks.filter(w => w.id !== id);
    }

    writeData(data);
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

    const data = readData();

    if (type === 'literary') {
      const index = data.literaryWorks.findIndex(w => w.id === id);
      if (index !== -1) {
        // 更新摘要
        const excerpt = workData.content.replace(/\n+/g, ' ').substring(0, 100) + '...';
        data.literaryWorks[index] = { ...data.literaryWorks[index], ...workData, excerpt };
      }
    } else if (type === 'photography') {
      const index = data.photographyWorks.findIndex(w => w.id === id);
      if (index !== -1) {
        data.photographyWorks[index] = { ...data.photographyWorks[index], ...workData };
      }
    }

    writeData(data);
    return NextResponse.json({ success: true, message: '更新成功' });
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json({ error: '更新失败' }, { status: 500 });
  }
}
