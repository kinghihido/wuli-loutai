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
  title: '层林尽染',
  subtitle: '技术流 · 工具链与研究笔记',
  description: '一个北大学生的技术笔记。记录 AI 工具链的演化、范德华材料转移的实验方法，以及前端工程化的踩坑。万山红遍，层林尽染。',
  github: 'https://github.com/kinghihido',
  email: '2500011140@stu.pku.edu.cn',
  location: '北京 · 燕园',
  role: '北京大学 · 材料方向',
  skills: [
    'TypeScript', 'React', 'Next.js', 'Python',
    'Tailwind CSS', 'shadcn/ui', 'Git', 'Vercel',
    'AI Prompting', '学术写作', '数据可视化',
  ],
  interests: [
    'AI 工具链', '前端开发', '材料科学', '足球',
    '实验方法', '开源贡献',
  ],
};
