# 竞海西渡个人作品网站 - 部署指南

## 项目概述

这是一个基于 Next.js 16 的个人作品展示网站，包含：
- 文学作品展示与管理
- 摄影作品展示与管理
- 内容编辑功能（需密码验证）
- 数据持久化存储

---

## 一、下载项目代码

**下载地址：** `/portfolio-export.tar.gz`（在本网站下载）

下载后解压：
```bash
tar -xzvf portfolio-export.tar.gz
```

---

## 二、本地运行

### 环境要求
- Node.js 18+
- pnpm（推荐）或 npm

### 安装依赖
```bash
pnpm install
# 或
npm install
```

### 运行开发服务器
```bash
pnpm dev
# 或
npm run dev
```

访问 http://localhost:5000

---

## 三、部署到 Vercel（推荐）

Vercel 是 Next.js 的官方托管平台，部署最简单。

### 步骤

1. **注册 Vercel 账号**
   - 访问 https://vercel.com
   - 可以用 GitHub 账号直接登录

2. **上传代码到 GitHub**
   ```bash
   # 初始化 git
   git init
   git add .
   git commit -m "Initial commit"
   
   # 创建 GitHub 仓库后
   git remote add origin https://github.com/你的用户名/portfolio.git
   git push -u origin main
   ```

3. **在 Vercel 导入项目**
   - 点击 "Add New Project"
   - 选择你的 GitHub 仓库
   - 点击 "Deploy"
   - 等待部署完成

### 重要：数据持久化

Vercel 是无服务器环境，本地文件系统是临时的。需要配置数据库：

**方案 A：使用 Supabase（推荐，免费）**
1. 注册 Supabase：https://supabase.com
2. 创建新项目
3. 创建数据表存储作品数据
4. 修改 API 连接数据库

**方案 B：使用 PlanetScale（MySQL）**
1. 注册：https://planetscale.com
2. 创建数据库
3. 配置连接

---

## 四、部署到 Netlify

### 步骤

1. **注册 Netlify 账号**
   - 访问 https://netlify.com

2. **上传代码到 GitHub**（同上）

3. **导入项目**
   - 点击 "Add new site" → "Import an existing project"
   - 选择 GitHub 仓库
   - Build command: `npm run build`
   - Publish directory: `.next`
   - 点击 "Deploy"

4. **安装 Next.js 插件**
   - 在项目根目录创建 `netlify.toml`：
   ```toml
   [build]
     command = "npm run build"
     publish = ".next"

   [[plugins]]
     package = "@netlify/plugin-nextjs"
   ```

---

## 五、部署到自己的服务器

### 准备工作
- 一台云服务器（阿里云、腾讯云、华为云等）
- 已安装 Node.js 18+

### 步骤

1. **上传代码到服务器**
   ```bash
   # 本地执行
   scp -r ./projects user@your-server:/var/www/
   ```

2. **安装依赖并构建**
   ```bash
   cd /var/www/projects
   npm install
   npm run build
   ```

3. **使用 PM2 守护进程**
   ```bash
   # 安装 PM2
   npm install -g pm2
   
   # 启动服务
   pm2 start npm --name "portfolio" -- start
   
   # 设置开机自启
   pm2 startup
   pm2 save
   ```

4. **配置 Nginx 反向代理**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:5000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       }
   }
   ```

5. **配置 SSL（HTTPS）**
   ```bash
   # 使用 Let's Encrypt 免费证书
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

---

## 六、数据存储方案对比

| 方案 | 适用场景 | 成本 | 持久性 |
|------|---------|------|--------|
| 本地文件 | 自建服务器 | 免费 | ✅ 永久 |
| Vercel KV | Vercel 部署 | 免费额度 | ✅ 永久 |
| Supabase | 任何平台 | 免费额度 | ✅ 永久 |
| PlanetScale | 任何平台 | 免费额度 | ✅ 永久 |

**推荐：**
- Vercel 部署 → 使用 Vercel KV 或 Supabase
- Netlify 部署 → 使用 Supabase
- 自建服务器 → 本地文件即可

---

## 七、功能配置

### 修改管理密码

编辑 `src/app/page.tsx`，找到以下代码：

```typescript
if (password === '114514') {
```

将 `114514` 改为你想要的密码。

### 修改网站标题

编辑 `src/app/layout.tsx`：

```typescript
title: {
  default: '竞海西渡 | 文学与摄影',
  template: '%s | 竞海西渡',
},
```

### 数据文件位置

- 作品数据：`data/site-data.json`
- 可直接编辑此文件修改内容

---

## 八、技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Next.js | 16 | 全栈框架 |
| React | 19 | UI 库 |
| TypeScript | 5 | 类型支持 |
| Tailwind CSS | 4 | 样式 |
| shadcn/ui | - | UI 组件 |
| Lucide Icons | - | 图标 |

---

## 九、常见问题

### Q: 部署后数据丢失？
A: Vercel/Netlify 的文件系统是临时的，需要使用数据库。推荐 Supabase（免费）。

### Q: 图片上传失败？
A: 图片存储需要对象存储服务。可以：
- 使用阿里云 OSS
- 使用腾讯云 COS
- 或改用图床服务

### Q: 端口被占用？
A: 修改 `.coze` 文件或启动命令中的端口号。

### Q: 构建失败？
A: 检查 Node.js 版本是否 >= 18，删除 `node_modules` 重新安装。

---

## 十、快速命令参考

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 构建生产版本
pnpm build

# 启动生产服务
pnpm start

# 类型检查
npx tsc --noEmit
```

---

## 十一、获取帮助

- Next.js 文档：https://nextjs.org/docs
- Vercel 文档：https://vercel.com/docs
- Supabase 文档：https://supabase.com/docs
- shadcn/ui 文档：https://ui.shadcn.com

---

祝部署顺利！有问题随时问。
