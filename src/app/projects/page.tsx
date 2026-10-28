import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Badge } from '@/components/ui/badge';
import { Github, Star, GitFork, ExternalLink } from 'lucide-react';

interface GitHubRepo {
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics: string[];
  private: boolean;
}

async function getRepos(): Promise<GitHubRepo[]> {
  try {
    const res = await fetch(
      'https://api.github.com/users/kinghihido/repos?sort=updated&per_page=10',
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const repos: GitHubRepo[] = await res.json();
    return repos.filter(r => !r.private);
  } catch {
    return [];
  }
}

export default async function ProjectsPage() {
  const repos = await getRepos();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          {/* 标题区 */}
          <div className="text-center mb-12">
            <div className="seal-stamp mx-auto mb-6" style={{ width: '3rem', height: '3rem', fontSize: '1rem' }}>
              作
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-wider mb-3">项目</h1>
            <div className="ink-line max-w-xs mx-auto mb-4" />
            <p className="font-serif text-muted-foreground tracking-wide">
              GitHub 公开项目 &middot; 实时数据
            </p>
          </div>

          {repos.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-serif text-muted-foreground tracking-wider">
                暂无公开项目 &middot; 前往{' '}
                <a href="https://github.com/kinghihido" target="_blank" className="text-primary hover:underline">
                  GitHub
                </a>
                {' '}查看
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-6">
              {repos.map((repo) => (
                <div key={repo.name} className="scroll-card group hover:border-primary/30 transition-all duration-200">
                  <div className="p-6 flex flex-col h-full">
                    {/* 项目名 */}
                    <div className="flex items-center gap-2 mb-3">
                      <Github className="w-4 h-4 text-muted-foreground" />
                      <h3 className="font-serif font-semibold tracking-wide group-hover:text-primary transition-colors">
                        {repo.name}
                      </h3>
                    </div>
                    {/* 描述 */}
                    <p className="font-serif text-sm text-muted-foreground flex-1 mb-4 line-clamp-2 leading-relaxed">
                      {repo.description || '暂无描述'}
                    </p>
                    {/* 统计 */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground font-serif mb-4">
                      {repo.language && (
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-primary" />
                          {repo.language}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3" /> {repo.stargazers_count}
                      </span>
                      <span className="flex items-center gap-1">
                        <GitFork className="w-3 h-3" /> {repo.forks_count}
                      </span>
                    </div>
                    {/* 标签 */}
                    {repo.topics.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {repo.topics.slice(0, 4).map((topic) => (
                          <span
                            key={topic}
                            className="font-serif text-xs px-2 py-0.5 border border-border rounded text-muted-foreground"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    )}
                    {/* 链接 */}
                    <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                      <span className="inline-flex items-center gap-2 w-full justify-center px-4 py-2 border border-border rounded font-serif text-sm tracking-wider text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors">
                        查看仓库 <ExternalLink className="w-3 h-3" />
                      </span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
