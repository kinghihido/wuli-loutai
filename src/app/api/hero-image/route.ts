import { NextRequest, NextResponse } from 'next/server';
import { S3Storage } from 'coze-coding-dev-sdk';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { createWriteStream, unlinkSync } from 'fs';

// 初始化存储
const storage = new S3Storage({
  endpointUrl: process.env.COZE_BUCKET_ENDPOINT_URL,
  accessKey: "",
  secretKey: "",
  bucketName: process.env.COZE_BUCKET_NAME,
  region: "cn-beijing",
});

// 支持的图片格式
const SUPPORTED_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/bmp',
  'image/tiff',
  'image/svg+xml',
  'image/heic',
  'image/heif',
];

// 最大文件大小：50MB
const MAX_FILE_SIZE = 50 * 1024 * 1024;

export async function POST(request: NextRequest) {
  let tempFilePath: string | null = null;
  
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: '请选择图片文件' }, { status: 400 });
    }

    // 验证文件类型
    const mimeType = file.type.toLowerCase();
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    
    // 支持带扩展名的判断
    const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'tiff', 'tif', 'svg', 'heic', 'heif'];
    
    if (!SUPPORTED_TYPES.includes(mimeType) && !imageExts.includes(ext)) {
      return NextResponse.json({ 
        error: `不支持的图片格式。支持格式：${imageExts.join(', ')}` 
      }, { status: 400 });
    }

    // 验证文件大小
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ 
        error: `图片文件过大，最大支持 ${MAX_FILE_SIZE / 1024 / 1024}MB` 
      }, { status: 400 });
    }

    // 保存临时文件
    tempFilePath = path.join(os.tmpdir(), `upload_${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`);
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(tempFilePath, buffer);

    // 生成存储路径
    const storageExt = ext === 'jpeg' ? 'jpg' : ext;
    const fileName = `hero/${Date.now()}_${Math.random().toString(36).substring(7)}.${storageExt}`;

    // 确定 content type
    let contentType = mimeType;
    if (ext === 'jpg' || ext === 'jpeg') contentType = 'image/jpeg';
    else if (ext === 'png') contentType = 'image/png';
    else if (ext === 'gif') contentType = 'image/gif';
    else if (ext === 'webp') contentType = 'image/webp';
    else if (ext === 'bmp') contentType = 'image/bmp';
    else if (ext === 'tiff' || ext === 'tif') contentType = 'image/tiff';
    else if (ext === 'svg') contentType = 'image/svg+xml';
    else if (ext === 'heic') contentType = 'image/heic';
    else if (ext === 'heif') contentType = 'image/heif';

    // 使用流式上传（支持大文件）
    const fileStream = fs.createReadStream(tempFilePath);
    const imageKey = await storage.streamUploadFile({
      stream: fileStream,
      fileName: fileName,
      contentType: contentType,
    });

    // 生成访问URL（有效期30天）
    const imageUrl = await storage.generatePresignedUrl({
      key: imageKey,
      expireTime: 2592000, // 30天
    });

    // 清理临时文件
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      unlinkSync(tempFilePath);
    }

    return NextResponse.json({
      success: true,
      imageKey: imageKey,
      imageUrl: imageUrl,
      message: '图片上传成功！',
    });
  } catch (error) {
    console.error('Upload hero image error:', error);
    
    // 清理临时文件
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      unlinkSync(tempFilePath);
    }
    
    return NextResponse.json({ error: '上传失败，请重试' }, { status: 500 });
  }
}
