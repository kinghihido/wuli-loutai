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

interface SiteData {
  hero: {
    title: string;
    subtitle: string;
    description: string;
  };
  about: {
    paragraphs: string[];
    tags: string[];
  };
  literaryWorks: LiteraryWork[];
  photographyWorks: Array<{
    id: number;
    title: string;
    description: string;
    category: string;
    image: string;
  }>;
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

    // 生成摘要（取前100字）
    const excerpt = textContent.replace(/\n+/g, ' ').substring(0, 100) + '...';

    // 读取现有数据
    const data = readData();

    // 生成新ID
    const maxId = data.literaryWorks.reduce((max: number, work: LiteraryWork) => Math.max(max, work.id), 0);
    const newId = maxId + 1;

    // 创建新作品
    const newWork: LiteraryWork = {
      id: newId,
      title: title.trim(),
      excerpt,
      category: category || '散文',
      date: date || new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' }),
      content: textContent,
    };

    // 添加到作品列表（放在最前面）
    data.literaryWorks.unshift(newWork);
    writeData(data);

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
