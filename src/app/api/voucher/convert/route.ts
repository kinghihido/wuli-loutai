import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.env.COZE_WORKSPACE_PATH || '/workspace/projects', 'data', 'site-data.json');

function readData() {
  if (!fs.existsSync(DATA_FILE)) {
    return { vouchers: [], usedVouchers: [] };
  }
  try {
    const content = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(content);
  } catch {
    return { vouchers: [], usedVouchers: [] };
  }
}

function writeData(data: any) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// 券类型配置
const voucherTypeConfig: Record<string, { name: string; icon: string; description: string }> = {
  dongge: { name: '冬戈定向券', icon: '🦌', description: '冬戈之鹿，奔跑炸裂' },
  xiaoshuo: { name: '骁朔定向券', icon: '📖', description: '开卷有益，知识无价' },
  guansai: { name: '观赛定向券', icon: '⚽', description: '足球不老，竞技永恒' },
};

// POST - 转化自选券
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { voucherId, newType } = body;
    const data = readData();
    
    data.vouchers = data.vouchers || [];
    
    const voucherIndex = data.vouchers.findIndex((v: any) => v.id === voucherId);
    if (voucherIndex === -1) {
      return NextResponse.json({ error: 'Voucher not found' }, { status: 404 });
    }
    
    const voucher = data.vouchers[voucherIndex];
    
    // 检查是否是自选券
    if (voucher.type !== 'zixuan') {
      return NextResponse.json({ error: 'Only zixuan voucher can be converted' }, { status: 400 });
    }
    
    // 获取新券配置
    const config = voucherTypeConfig[newType];
    if (!config) {
      return NextResponse.json({ error: 'Invalid voucher type' }, { status: 400 });
    }
    
    // 转化券
    const newVoucher = {
      ...voucher,
      type: newType,
      name: config.name,
      description: config.description,
      convertedAt: new Date().toISOString(),
    };
    
    data.vouchers[voucherIndex] = newVoucher;
    writeData(data);
    
    return NextResponse.json({ 
      success: true, 
      message: `成功转化为「${config.name}」`,
      newVoucher,
    });
  } catch (error) {
    console.error('Convert voucher error:', error);
    return NextResponse.json({ error: 'Failed to convert voucher' }, { status: 500 });
  }
}
