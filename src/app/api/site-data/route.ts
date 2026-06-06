import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { S3Storage } from 'coze-coding-dev-sdk';

// 数据文件路径
const DATA_FILE = path.join(process.env.COZE_WORKSPACE_PATH || '/workspace/projects', 'data', 'site-data.json');

// 初始化存储（用于刷新签名URL）
const storage = new S3Storage({
  endpointUrl: process.env.COZE_BUCKET_ENDPOINT_URL,
  accessKey: "",
  secretKey: "",
  bucketName: process.env.COZE_BUCKET_NAME,
  region: "cn-beijing",
});

// 刷新heroImages的签名URL
async function refreshHeroImageUrls(heroImages: any[]): Promise<any[]> {
  if (!heroImages || heroImages.length === 0) return heroImages;
  
  const refreshed = await Promise.all(
    heroImages.map(async (img) => {
      if (img.imageKey) {
        try {
          const newUrl = await storage.generatePresignedUrl({
            key: img.imageKey,
            expireTime: 2592000,
          });
          return { ...img, url: newUrl };
        } catch (e) {
          console.error('Failed to refresh URL for', img.imageKey, e);
          return img;
        }
      }
      return img;
    })
  );
  return refreshed;
}

// 确保数据目录存在
function ensureDataDir() {
  const dataDir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// 默认数据
const defaultData = {
  hero: {
    title: '用文字书写诗意',
    subtitle: '用镜头捕捉光影',
    description: '我是竞海西渡，一个热爱文学与摄影的创作者。在这里，记录生活中的诗意与美好。',
  },
  heroImages: [],
  about: {
    paragraphs: [
      '我是竞海西渡，一个热爱文学与摄影的创作者，现求学于燕园。在文字的世界里，我寻找生活的诗意；在镜头的光影中，我捕捉世界的美好。',
      '文学让我学会用文字表达内心的情感与思考，摄影让我学会用镜头观察世界的细节与瞬间。两者相辅相成，成为我认识世界、表达自我的方式。',
      '我相信，生活中处处都有诗意，只需要用心去发现。希望我的作品能带给你一些美好的感受。',
    ],
    tags: ['散文创作', '风光摄影', '人文纪实'],
  },
  literaryWorks: [],
  photographyWorks: [],
};

// 读取数据
function readData() {
  ensureDataDir();
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(defaultData, null, 2));
    return defaultData;
  }
  try {
    const content = fs.readFileSync(DATA_FILE, 'utf-8');
    const data = JSON.parse(content);
    return {
      ...defaultData,
      ...data,
      heroImages: data.heroImages || [],
    };
  } catch {
    return defaultData;
  }
}

// 写入数据
function writeData(data: typeof defaultData) {
  ensureDataDir();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// GET - 获取数据
export async function GET() {
  const data = readData();
  return NextResponse.json(data);
}

// POST - 更新数据
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const currentData = readData();
    
    // 合并更新
    const newData = { ...currentData, ...body };
    writeData(newData);
    
    return NextResponse.json({ success: true, data: newData });
  } catch (error) {
    console.error('Save data error:', error);
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
  }
}
