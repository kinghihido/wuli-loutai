import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.env.COZE_WORKSPACE_PATH || '/workspace/projects', 'data', 'site-data.json');

interface Task {
  id: string;
  title: string;
  type: 'daily' | 'weekly' | 'custom';
  completed: boolean;
  createdAt: string;
  completedAt?: string;
  deadline: string;
  reward: number;
  penalty: number;
  deducted?: boolean; // 是否已扣款
}

function readData() {
  if (!fs.existsSync(DATA_FILE)) {
    return { tasks: [], coins: 0 };
  }
  try {
    const content = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(content);
  } catch {
    return { tasks: [], coins: 0 };
  }
}

function writeData(data: any) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
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
  
  data.tasks.forEach((task: Task) => {
    if (!task.completed && !task.deducted) {
      const deadline = new Date(task.deadline);
      if (deadline < now) {
        // 任务过期未完成，扣除代币
        task.deducted = true;
        totalDeduction += task.penalty;
      }
    }
  });
  
  if (totalDeduction > 0) {
    data.coins = (data.coins || 0) - totalDeduction;
  }
  
  return totalDeduction;
}

// 生成每日任务
function generateDailyTasks(): Task[] {
  const today = getTodayStr();
  const deadline = getTodayEnd();
  const dailyNames = ['早起', '三餐'];
  
  return dailyNames.map((name) => ({
    id: `daily-${today}-${name}`,
    title: name,
    type: 'daily' as const,
    completed: false,
    createdAt: new Date().toISOString(),
    deadline,
    reward: 100,
    penalty: 50,
  }));
}

// 生成每周任务
function generateWeeklyTasks(): Task[] {
  const weekStart = getWeekStartStr();
  const deadline = getWeekEnd();
  const weeklyNames = ['物理', '数学', '英语', '英语听力', '英语阅读', '计算概论'];
  
  return weeklyNames.map((name) => ({
    id: `weekly-${weekStart}-${name}`,
    title: name,
    type: 'weekly' as const,
    completed: false,
    createdAt: new Date().toISOString(),
    deadline,
    reward: 500,
    penalty: 250,
  }));
}

// 同步任务：检查过期扣款、生成每日/每周任务
function syncTasks(data: any) {
  // 检查过期任务并扣款
  checkAndDeductExpiredTasks(data);
  
  const today = getTodayStr();
  const weekStart = getWeekStartStr();
  
  data.tasks = data.tasks || [];
  
  // 过滤掉过期的每日/每周任务
  data.tasks = data.tasks.filter((task: Task) => {
    if (task.type === 'daily') {
      // ID格式: daily-YYYY-MM-DD-任务名
      // 提取日期部分: split后[1]到[3]是年月日
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
    // 保留自定义任务
    return true;
  });
  
  // 检查是否需要生成新的每日任务
  const todayDailyTasks = data.tasks.filter((t: Task) => t.type === 'daily');
  if (todayDailyTasks.length === 0) {
    const newDailyTasks = generateDailyTasks();
    data.tasks.push(...newDailyTasks);
  }
  
  // 检查是否需要生成新的每周任务
  const thisWeekWeeklyTasks = data.tasks.filter((t: Task) => t.type === 'weekly');
  if (thisWeekWeeklyTasks.length === 0) {
    const newWeeklyTasks = generateWeeklyTasks();
    data.tasks.push(...newWeeklyTasks);
  }
  
  return data;
}

// GET - 获取任务列表
export async function GET() {
  try {
    let data = readData();
    data = syncTasks(data);
    writeData(data);
    
    return NextResponse.json({ 
      success: true, 
      tasks: data.tasks || [],
      coins: data.coins || 0
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    return NextResponse.json({ error: 'Failed to get tasks' }, { status: 500 });
  }
}

// POST - 添加自定义任务
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    let data = readData();
    
    // 同步任务
    data = syncTasks(data);
    
    const newTask: Task = {
      id: `custom-${Date.now()}`,
      title: body.title,
      type: 'custom',
      completed: false,
      createdAt: new Date().toISOString(),
      deadline: body.deadline,
      reward: body.reward,
      penalty: body.penalty || Math.floor(body.reward * 0.5),
    };
    
    data.tasks = data.tasks || [];
    data.tasks.push(newTask);
    writeData(data);
    
    return NextResponse.json({ success: true, task: newTask, coins: data.coins });
  } catch (error) {
    console.error('Add task error:', error);
    return NextResponse.json({ error: 'Failed to add task' }, { status: 500 });
  }
}

// PUT - 完成任务
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    let data = readData();
    const { taskId, action } = body;
    
    // 同步任务
    data = syncTasks(data);
    
    data.tasks = data.tasks || [];
    
    const taskIndex = data.tasks.findIndex((t: Task) => t.id === taskId);
    if (taskIndex === -1) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    
    if (action === 'complete') {
      const task = data.tasks[taskIndex];
      
      // 检查是否已过期
      if (new Date(task.deadline) < new Date()) {
        return NextResponse.json({ error: 'Task has expired' }, { status: 400 });
      }
      
      // 完成任务
      task.completed = true;
      task.completedAt = new Date().toISOString();
      
      // 增加代币
      data.coins = (data.coins || 0) + task.reward;
      
      writeData(data);
      return NextResponse.json({ 
        success: true, 
        task, 
        coins: data.coins,
        reward: task.reward 
      });
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Update task error:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

// DELETE - 删除任务（仅限自定义任务）
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('taskId');
    
    if (!taskId) {
      return NextResponse.json({ error: 'Task ID required' }, { status: 400 });
    }
    
    let data = readData();
    data = syncTasks(data);
    
    data.tasks = data.tasks || [];
    const task = data.tasks.find((t: Task) => t.id === taskId);
    
    // 只能删除自定义任务
    if (task && task.type !== 'custom') {
      return NextResponse.json({ error: 'Cannot delete auto-generated tasks' }, { status: 400 });
    }
    
    data.tasks = data.tasks.filter((t: Task) => t.id !== taskId);
    writeData(data);
    
    return NextResponse.json({ success: true, coins: data.coins });
  } catch (error) {
    console.error('Delete task error:', error);
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}
