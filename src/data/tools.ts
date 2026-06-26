export interface Tool {
  name: string;
  description: string;
  url: string;
  category: 'llm' | 'coding' | 'productivity' | 'multimodal';
  icon?: string;
  tags: string[];
}

export const tools: Tool[] = [
  {
    name: 'WorkBuddy',
    description: 'AI 驱动的桌面工作伙伴，集成本地文件系统、终端访问、网页搜索等能力，打造全栈开发与学术研究的一站式助手。',
    url: 'https://www.codebuddy.cn',
    category: 'coding',
    tags: ['AI助手', '桌面端', '全栈'],
  },
  {
    name: 'ChatGPT',
    description: 'OpenAI 出品的大语言模型对话平台，支持 GPT-4o、代码解释器、DALL-E 图像生成和联网搜索。',
    url: 'https://chat.openai.com',
    category: 'llm',
    tags: ['大模型', '对话', '多模态'],
  },
  {
    name: 'Claude',
    description: 'Anthropic 出品的 AI 助手，在长文本理解、编程辅助和深度推理方面表现出色。',
    url: 'https://claude.ai',
    category: 'llm',
    tags: ['大模型', '长文本', '编程'],
  },
  {
    name: 'GitHub Copilot',
    description: 'GitHub 推出的 AI 编程助手，深度集成 VS Code，提供实时代码补全和聊天功能。',
    url: 'https://github.com/features/copilot',
    category: 'coding',
    tags: ['代码补全', 'VS Code', 'AI编程'],
  },
  {
    name: 'Cursor',
    description: 'AI-first 代码编辑器，基于 VS Code 构建，内置强大的 AI 编程能力和代码库上下文理解。',
    url: 'https://cursor.sh',
    category: 'coding',
    tags: ['编辑器', 'AI编程', '代码库'],
  },
  {
    name: 'Vercel',
    description: '前端部署平台，支持 Next.js 等框架的无缝部署、边缘函数、KV 存储和分析。',
    url: 'https://vercel.com',
    category: 'coding',
    tags: ['部署', '前端', 'Serverless'],
  },
  {
    name: 'Midjourney',
    description: '顶级 AI 图像生成工具，通过 Discord 交互，生成高质量艺术和设计作品。',
    url: 'https://www.midjourney.com',
    category: 'multimodal',
    tags: ['图像生成', '艺术', '设计'],
  },
  {
    name: 'Sora',
    description: 'OpenAI 推出的文生视频模型，可根据文本描述生成逼真的视频内容。',
    url: 'https://sora.com',
    category: 'multimodal',
    tags: ['视频生成', 'AI视频', '多模态'],
  },
  {
    name: 'Notion AI',
    description: 'Notion 内置的 AI 功能，辅助写作、总结、翻译和知识管理。',
    url: 'https://www.notion.so/product/ai',
    category: 'productivity',
    tags: ['笔记', '写作', '知识管理'],
  },
  {
    name: 'Perplexity',
    description: 'AI 驱动的搜索引擎，提供带引用的实时答案，适合学术研究和事实核查。',
    url: 'https://www.perplexity.ai',
    category: 'llm',
    tags: ['搜索', '研究', '引用'],
  },
  {
    name: 'Replit',
    description: '在线编程平台，内置 AI Agent，从自然语言描述直接生成可运行的 Web 应用。',
    url: 'https://replit.com',
    category: 'coding',
    tags: ['在线IDE', 'AI编程', '部署'],
  },
  {
    name: 'WPS AI',
    description: '金山办公推出的 AI 办公助手，支持文档生成、PPT 制作、表格分析和 PDF 处理。',
    url: 'https://ai.wps.cn',
    category: 'productivity',
    tags: ['办公', '文档', '国产'],
  },
];

export const categoryMeta: Record<Tool['category'], { label: string; emoji: string; description: string }> = {
  llm: { label: '大语言模型', emoji: '🧠', description: '对话、推理、生成类 AI' },
  coding: { label: '编程工具', emoji: '💻', description: '代码补全、编辑器、部署' },
  productivity: { label: '效率工具', emoji: '⚡', description: '办公、笔记、知识管理' },
  multimodal: { label: '多模态', emoji: '🎨', description: '图像、视频、音频生成' },
};
