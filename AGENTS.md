# 竞海西渡个人作品网站

## 项目概览
- 概述: 个人文学与摄影作品网站，支持作品展示、任务系统、定向券管理
- 技术栈: Next.js 16 + React 19 + TypeScript + Tailwind CSS 4 + shadcn/ui
- 数据存储: 本地JSON文件 (`data/site-data.json`)

## 目录结构
```
├── public/                    # 静态资源
├── scripts/                    # 构建与启动脚本
├── src/
│   ├── app/                    # 页面路由与布局
│   │   ├── page.tsx           # 主页面
│   │   └── api/               # API路由
│   │       ├── site-data/     # 数据API
│   │       ├── hero-image/    # Hero图片上传
│   │       ├── task/          # 任务API
│   │       ├── voucher/       # 定向券API
│   │       └── exchange/      # 兑换API
│   ├── components/ui/         # UI组件
│   │   ├── hero-carousel.tsx # Hero轮播组件
│   │   ├── task-list.tsx     # 任务列表
│   │   ├── assets.tsx        # 个人资产
│   │   ├── exchange.tsx      # 兑换所
│   │   └── voucher.tsx       # 定向券
│   ├── hooks/                 # 自定义Hooks
│   └── lib/utils.ts           # 工具函数
├── data/                      # 数据存储目录
└── .coze                      # 项目配置
```

## 核心功能

### 1. Hero轮播系统
- 支持多张图片自动轮播（5秒间隔）
- 全屏左右顶满布局
- 文字叠加在图片上
- 支持格式: JPG, PNG, GIF, WebP, BMP, TIFF, SVG, HEIC
- 最大文件大小: 50MB
- 管理模式可上传/删除图片

### 2. 任务系统
- **每日任务**: 早起、三餐，奖励100代币，50惩罚
- **每周任务**: 6门学科（物理、数学、英语、英语听力、英语阅读、计算概论），奖励500代币，250惩罚
- **自定义任务**: 可自定义名称、奖励(100/200/500)、截止时间
- 任务自动生成与重置
- 已完成任务自动消失

### 3. 定向券系统
- 四种特色券: 冬戈、骁朔、观赛、自选
- 冬戈率统计: 今年已过天数 / 冬戈券使用数
- 兑换所支持代币兑换券

### 4. 兑换所定价
| 券种 | 价格(代币) |
|------|-----------|
| 骁朔 | 500 |
| 观赛 | 750 |
| 冬戈 | 1500 |
| 自选 | 2000 |

## 开发命令
```bash
pnpm install      # 安装依赖
pnpm dev          # 开发环境 (端口5000)
pnpm build        # 生产构建
pnpm start        # 生产环境
```

## 环境变量
- `COZE_WORKSPACE_PATH`: 工作目录
- `COZE_PROJECT_DOMAIN_DEFAULT`: 访问域名
- `DEPLOY_RUN_PORT`: 服务端口(5000)

## 管理功能
- 管理密码: 114514
- Session存储维持登录状态

## 关键文件修改记录
- `src/app/page.tsx`: 主页面，集成Hero轮播、任务、资产
- `src/components/ui/hero-carousel.tsx`: Hero轮播组件
- `src/app/api/hero-image/route.ts`: 图片上传API
- `src/app/api/site-data/route.ts`: 数据持久化
