import { NextRequest, NextResponse } from 'next/server';
import { handleUpload } from '@vercel/blob';

export const dynamic = 'force-dynamic';

/**
 * POST /api/blob-upload
 * 服务端授权客户端直传 Vercel Blob
 * 客户端 @vercel/blob/client 的 put() 会调用此接口获取上传 URL
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const jsonResponse = await handleUpload({
      body,
      allowedContainers: ['public'],
    });
    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error('Blob upload auth error:', error);
    return NextResponse.json(
      { error: '上传授权失败，请重试' },
      { status: 500 }
    );
  }
}
