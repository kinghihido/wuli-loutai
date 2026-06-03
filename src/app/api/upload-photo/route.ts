import { NextRequest, NextResponse } from 'next/server';
import { S3Storage } from 'coze-coding-dev-sdk';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.env.COZE_WORKSPACE_PATH || '/workspace/projects', 'data', 'site-data.json');

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
  literaryWorks: Array<{ id: number; title: string; excerpt: string; category: string; date: string; content: string }>;
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

// 初始化存储
const storage = new S3Storage({
  endpointUrl: process.env.COZE_BUCKET_ENDPOINT_URL,
  accessKey: "",
  secretKey: "",
  bucketName: process.env.COZE_BUCKET_NAME,
  region: "cn-beijing",
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string || '';
    const category = formData.get('category') as string || '风光';
    const date = formData.get('date') as string;

    if (!file) {
      return NextResponse.json({ error: '请选择图片文件' }, { status: 400 });
    }

    if (!title) {
      return NextResponse.json({ error: '请输入作品标题' }, { status: 400 });
    }

    // 读取文件内容
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 生成文件名
    const ext = file.name.split('.').pop() || 'jpg';
    const fileName = `photography/${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`;

    // 上传到对象存储
    const imageKey = await storage.uploadFile({
      fileContent: buffer,
      fileName: fileName,
      contentType: file.type || 'image/jpeg',
    });

    // 生成访问URL（有效期30天）
    const imageUrl = await storage.generatePresignedUrl({
      key: imageKey,
      expireTime: 2592000, // 30天
    });

    // 读取现有数据
    const data = readData();

    // 生成新ID
    const maxId = data.photographyWorks.reduce((max, work) => Math.max(max, work.id), 0);
    const newId = maxId + 1;

    // 创建新作品
    const newWork: PhotographyWork = {
      id: newId,
      title,
      description,
      category,
      image: imageUrl,
      imageKey,
    };

    // 添加到列表
    data.photographyWorks.unshift(newWork);
    writeData(data);

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
