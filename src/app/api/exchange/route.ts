import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { VoucherType } from '@/components/ui/voucher';

const DATA_FILE = path.join(process.env.COZE_WORKSPACE_PATH || '/workspace/projects', 'data', 'site-data.json');

// 券兑换价格
const exchangePrices: Record<VoucherType, number> = {
  xiaoshuo: 500,
  guansai: 750,
  dongge: 1500,
  zixuan: 2000,
};

// 券名称和描述
const voucherInfo: Record<VoucherType, { name: string; description: string }> = {
  dongge: { name: '冬戈定向券', description: '冬戈之鹿，奔跑炸裂' },
  xiaoshuo: { name: '骁朔定向券', description: '开卷有益，知识无价' },
  guansai: { name: '观赛定向券', description: '足球不老，竞技永恒' },
  zixuan: { name: '自选券', description: '自由选择心仪的定向券' },
};

function readData() {
  if (!fs.existsSync(DATA_FILE)) {
    return { coins: 0, vouchers: [] };
  }
  try {
    const content = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(content);
  } catch {
    return { coins: 0, vouchers: [] };
  }
}

function writeData(data: any) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// POST - 兑换券
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, cost } = body as { type: VoucherType; cost: number };
    
    if (!type || !exchangePrices[type]) {
      return NextResponse.json({ error: 'Invalid voucher type' }, { status: 400 });
    }
    
    const expectedCost = exchangePrices[type];
    if (cost !== expectedCost) {
      return NextResponse.json({ error: 'Invalid exchange cost' }, { status: 400 });
    }
    
    const data = readData();
    
    // 检查代币是否足够
    if ((data.coins || 0) < cost) {
      return NextResponse.json({ error: 'Insufficient coins' }, { status: 400 });
    }
    
    // 扣除代币
    data.coins = (data.coins || 0) - cost;
    
    // 添加券
    const info = voucherInfo[type];
    const newVoucher = {
      id: `voucher-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: info.name,
      type,
      description: info.description,
      createdAt: new Date().toISOString(),
      exchanged: true,
      exchangedAt: new Date().toISOString(),
      exchangeCost: cost,
    };
    
    data.vouchers = data.vouchers || [];
    data.vouchers.push(newVoucher);
    
    writeData(data);
    
    return NextResponse.json({ 
      success: true, 
      voucher: newVoucher,
      coins: data.coins 
    });
  } catch (error) {
    console.error('Exchange error:', error);
    return NextResponse.json({ error: 'Failed to exchange' }, { status: 500 });
  }
}
