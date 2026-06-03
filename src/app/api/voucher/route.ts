import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.env.COZE_WORKSPACE_PATH || '/workspace/projects', 'data', 'site-data.json');

function readData() {
  if (!fs.existsSync(DATA_FILE)) {
    return { vouchers: [], usedVouchers: [], donggeUsedCount: 0 };
  }
  try {
    const content = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(content);
  } catch {
    return { vouchers: [], usedVouchers: [], donggeUsedCount: 0 };
  }
}

function writeData(data: any) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// POST - 使用定向券
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { voucherId } = body;
    const data = readData();
    
    data.vouchers = data.vouchers || [];
    data.usedVouchers = data.usedVouchers || [];
    data.donggeUsedCount = data.donggeUsedCount || 0;
    
    const voucherIndex = data.vouchers.findIndex((v: any) => v.id === voucherId);
    if (voucherIndex === -1) {
      return NextResponse.json({ error: 'Voucher not found' }, { status: 404 });
    }
    
    const voucher = data.vouchers[voucherIndex];
    
    // 从库存移除
    data.vouchers.splice(voucherIndex, 1);
    
    // 添加到使用历史
    data.usedVouchers.push({
      voucher,
      usedAt: new Date().toISOString(),
    });
    
    // 如果是冬戈券，增加使用计数
    if (voucher.type === 'dongge') {
      data.donggeUsedCount += 1;
    }
    
    writeData(data);
    
    return NextResponse.json({ 
      success: true, 
      message: `成功使用「${voucher.name}」`,
      vouchers: data.vouchers,
      usedVouchers: data.usedVouchers,
      donggeUsedCount: data.donggeUsedCount,
    });
  } catch (error) {
    console.error('Use voucher error:', error);
    return NextResponse.json({ error: 'Failed to use voucher' }, { status: 500 });
  }
}

// GET - 获取券列表
export async function GET() {
  const data = readData();
  return NextResponse.json({
    vouchers: data.vouchers || [],
    usedVouchers: data.usedVouchers || [],
    donggeUsedCount: data.donggeUsedCount || 0,
  });
}
