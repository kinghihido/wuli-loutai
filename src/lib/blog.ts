import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  category: string;
  tags: string[];
  content: string;
  readingTime: number;
}

const blogDir = path.join(process.cwd(), 'content/blog');

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(blogDir)) return [];

  const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.md'));
  const posts = files.map((file) => {
    const raw = fs.readFileSync(path.join(blogDir, file), 'utf-8');
    const { data, content } = matter(raw);
    const wordCount = content.split(/\s+/).length;
    return {
      slug: file.replace(/\.md$/, ''),
      title: data.title || 'Untitled',
      date: data.date || 'Unknown',
      excerpt: data.excerpt || content.slice(0, 150).replace(/#/g, '') + '...',
      category: data.category || '未分类',
      tags: data.tags || [],
      content,
      readingTime: Math.max(1, Math.ceil(wordCount / 300)),
    } as BlogPost;
  });

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): BlogPost | null {
  const filePath = path.join(blogDir, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  const wordCount = content.split(/\s+/).length;
  return {
    slug,
    title: data.title || 'Untitled',
    date: data.date || 'Unknown',
    excerpt: data.excerpt || '',
    category: data.category || '未分类',
    tags: data.tags || [],
    content,
    readingTime: Math.max(1, Math.ceil(wordCount / 300)),
  };
}

export function getAllCategories(): string[] {
  const posts = getAllPosts();
  return [...new Set(posts.map(p => p.category))];
}

export function getAllTags(): string[] {
  const posts = getAllPosts();
  return [...new Set(posts.flatMap(p => p.tags))];
}
