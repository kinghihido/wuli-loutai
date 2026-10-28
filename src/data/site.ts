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
  title: '雾里楼台',
  subtitle: '笔墨之间，自有天地',
  description: '一个北大学生的创作空间。记录日常感悟、学术思考与随想杂记。雾里看花，楼台望月，皆是文章。',
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
    '文学创作', '开源贡献',
  ],
};
