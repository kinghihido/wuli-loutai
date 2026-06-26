export interface SiteInfo {
  name: string;
  title: string;
  subtitle: string;
  description: string;
  github: string;
  email: string;
  location: string;
  role: string;
  skills: string[];
  interests: string[];
}

export const siteInfo: SiteInfo = {
  name: 'Black',
  title: 'Black Geek',
  subtitle: 'AI 时代的技术探索者',
  description: '北京大学研究人员，专注于 AI 技术应用、范德华材料转移研究（EDL 方法）。热爱编程，沉迷 AI 工具链。',
  github: 'https://github.com/kinghihido',
  email: '2500011140@stu.pku.edu.cn',
  location: '北京 · 燕园',
  role: '北京大学 · 研究人员 / 学生',
  skills: [
    'TypeScript', 'React', 'Next.js', 'Python',
    'Tailwind CSS', 'shadcn/ui', 'Git', 'Vercel',
    'AI Prompting', '学术写作', '数据可视化',
  ],
  interests: [
    'AI 工具链', '前端开发', '材料科学', '足球',
    '文学创作', '开源贡献',
  ],
};
