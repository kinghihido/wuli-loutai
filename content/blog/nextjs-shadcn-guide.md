---
title: '我的 Next.js 16 + shadcn/ui 技术选型指南'
date: '2026-06-26'
excerpt: '从零搭建了一个全栈个人网站后的经验总结，分享技术选型的考量和踩过的坑。'
category: '技术分享'
tags: ['Next.js', 'shadcn/ui', 'TypeScript', '前端', 'Vercel']
---

# 我的 Next.js 16 + shadcn/ui 技术选型指南

## 为什么选 Next.js？

经过多次项目实践，Next.js 已经成为我个人项目的默认选择。理由很简单：

1. **全栈能力**：API Routes + Server Components 一条龙
2. **Vercel 原生支持**：push 即部署，无需额外配置
3. **TypeScript 一等公民**：类型安全开箱即用
4. **App Router**：基于文件系统的路由，直观且强大

## 为什么选 shadcn/ui？

不是组件库，是**代码生成工具**：

- 组件代码直接在你的项目中，可自由修改
- 基于 Radix UI，可访问性有保障
- Tailwind CSS 深度集成，无需额外样式方案
- 按需引入，不会拖累 bundle size

## 我的技术栈组合

```
框架：Next.js 16 (App Router)
语言：TypeScript 5
样式：Tailwind CSS v4
组件：shadcn/ui (基于 Radix UI)
图标：Lucide React
部署：Vercel
包管理：pnpm
```

## 几个实用技巧

### 1. 善用 Server Components

能放在服务端渲染的内容就不要变成 Client Component。特别是数据获取、静态内容渲染。

```typescript
// 服务端组件：直接读取文件系统
export default async function BlogList() {
  const posts = getAllPosts(); // 直接读 fs
  return posts.map(post => <BlogCard key={post.slug} post={post} />);
}
```

### 2. 条件性的 Client Component

用 `"use client"` 把交互逻辑包裹在最小的组件中：

```typescript
// ❌ 整个页面变成客户端
'use client';
export default function Page() { /* ... */ }

// ✅ 只把交互部分变成客户端
import { InteractiveWidget } from './widget';
export default function Page() {
  return <div><StaticContent /><InteractiveWidget /></div>;
}
```

### 3. 充分利用 CSS 变量

shadcn/ui 的 CSS 变量体系非常好用，一个变量改变全局主题：

```css
:root {
  --primary: oklch(0.5 0.18 260); /* 一键换主题色 */
}
```

## 踩过的坑

- **Vercel 函数体 4.5MB 限制**：大项目注意拆分 API
- **pnpm lockfile**：Vercel 会自动识别 pnpm，不用手动处理
- **动态路由缓存**：`generateStaticParams` 配合 ISR 效果很好

---

希望这些经验能帮你少走弯路。技术选型没有银弹，适合你的才是最好的。
