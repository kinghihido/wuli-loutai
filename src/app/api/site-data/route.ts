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
      // 如果有imageKey，用key重新生成签名URL
      if (img.imageKey) {
        try {
          const newUrl = await storage.generatePresignedUrl({
            key: img.imageKey,
            expireTime: 2592000, // 30天
          });
          return { ...img, url: newUrl };
        } catch (e) {
          console.error('Failed to refresh URL for', img.imageKey, e);
          return img; // 保持原URL
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

// 获取今天日期字符串
function getTodayStr() {
  return new Date().toISOString().split('T')[0];
}

// 获取本周开始日期字符串
function getWeekStartStr() {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  now.setDate(now.getDate() - daysToSubtract);
  return now.toISOString().split('T')[0];
}

// 获取今天结束时间
function getTodayEnd() {
  const now = new Date();
  now.setHours(23, 59, 59, 999);
  return now.toISOString();
}

// 获取本周日结束时间
function getWeekEnd() {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const daysUntilSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
  now.setDate(now.getDate() + daysUntilSunday);
  now.setHours(23, 59, 59, 999);
  return now.toISOString();
}

// 检查并扣除过期未完成任务的代币
function checkAndDeductExpiredTasks(data: any) {
  const now = new Date();
  let totalDeduction = 0;
  
  data.tasks = data.tasks || [];
  
  data.tasks.forEach((task: any) => {
    if (!task.completed && !task.deducted) {
      const deadline = new Date(task.deadline);
      if (deadline < now) {
        task.deducted = true;
        totalDeduction += task.penalty || 0;
      }
    }
  });
  
  if (totalDeduction > 0) {
    data.coins = (data.coins || 0) - totalDeduction;
  }
  
  return totalDeduction;
}

// 生成每日任务
function generateDailyTasks(): any[] {
  const today = getTodayStr();
  const deadline = getTodayEnd();
  const dailyNames = ['早起', '三餐'];
  
  return dailyNames.map((name) => ({
    id: `daily-${today}-${name}`,
    title: name,
    type: 'daily',
    completed: false,
    createdAt: new Date().toISOString(),
    deadline,
    reward: 100,
    penalty: 50,
  }));
}

// 生成每周任务
function generateWeeklyTasks(): any[] {
  const weekStart = getWeekStartStr();
  const deadline = getWeekEnd();
  const weeklyNames = ['物理', '数学', '英语', '英语听力', '英语阅读', '计算概论'];
  
  return weeklyNames.map((name) => ({
    id: `weekly-${weekStart}-${name}`,
    title: name,
    type: 'weekly',
    completed: false,
    createdAt: new Date().toISOString(),
    deadline,
    reward: 500,
    penalty: 250,
  }));
}

// 同步任务
function syncTasks(data: any) {
  // 检查过期任务并扣款
  checkAndDeductExpiredTasks(data);
  
  const today = getTodayStr();
  const weekStart = getWeekStartStr();
  
  data.tasks = data.tasks || [];
  
  // 过滤掉过期的每日/每周任务
  data.tasks = data.tasks.filter((task: any) => {
    if (task.type === 'daily') {
      // ID格式: daily-YYYY-MM-DD-任务名
      const parts = task.id.split('-');
      const taskDate = `${parts[1]}-${parts[2]}-${parts[3]}`;
      return taskDate === today;
    }
    if (task.type === 'weekly') {
      // ID格式: weekly-YYYY-MM-DD-任务名
      const parts = task.id.split('-');
      const taskWeek = `${parts[1]}-${parts[2]}-${parts[3]}`;
      return taskWeek === weekStart;
    }
    return true;
  });
  
  // 检查是否需要生成新的每日任务
  const todayDailyTasks = data.tasks.filter((t: any) => t.type === 'daily');
  if (todayDailyTasks.length === 0) {
    const newDailyTasks = generateDailyTasks();
    data.tasks.push(...newDailyTasks);
  }
  
  // 检查是否需要生成新的每周任务
  const thisWeekWeeklyTasks = data.tasks.filter((t: any) => t.type === 'weekly');
  if (thisWeekWeeklyTasks.length === 0) {
    const newWeeklyTasks = generateWeeklyTasks();
    data.tasks.push(...newWeeklyTasks);
  }
  
  return data;
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
  tasks: [],
  vouchers: [],
  usedVouchers: [],
  donggeUsedCount: 0,
  coins: 0,
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
    // 确保新字段存在
    const result = {
      ...defaultData,
      ...data,
      tasks: data.tasks || [],
      vouchers: data.vouchers || [],
      usedVouchers: data.usedVouchers || [],
      donggeUsedCount: data.donggeUsedCount ?? 0,
      coins: data.coins ?? 0,
      heroImages: data.heroImages || [],
    };
    // 同步任务
    return syncTasks(result);
  } catch {
    return defaultData;
  }
}

// 写入数据
function writeData(data: typeof defaultData) {
  ensureDataDir();
  // 同步任务后再写入
  const syncedData = syncTasks(data);
  fs.writeFileSync(DATA_FILE, JSON.stringify(syncedData, null, 2));
}

// GET - 获取数据
export async function GET() {
  const data = readData();
  // 同步后写回文件
  writeData(data);
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
