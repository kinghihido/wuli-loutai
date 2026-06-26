import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Github, Star, GitFork, ExternalLink, FolderGit2 } from 'lucide-react';

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
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <h1 className="text-4xl font-bold tracking-tight mb-3">项目展示</h1>
            <p className="text-muted-foreground">
              GitHub 公开项目列表，实时数据来自 GitHub API。
            </p>
          </div>

          {repos.length === 0 ? (
            <Card className="p-12 text-center">
              <FolderGit2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                暂无公开项目或 API 请求失败。前往{' '}
                <a href="https://github.com/kinghihido" target="_blank" className="text-primary hover:underline">
                  GitHub
                </a>
                {' '}查看。
              </p>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {repos.map((repo) => (
                <Card key={repo.name} className="hover:shadow-md hover:border-primary/30 transition-all duration-200 flex flex-col">
                  <CardContent className="p-5 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                      <Github className="w-4 h-4 text-muted-foreground" />
                      <h3 className="font-semibold truncate">{repo.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground flex-1 mb-4 line-clamp-2">
                      {repo.description || '暂无描述'}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        {repo.language && (
                          <span className="flex items-center gap-1">
                            <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                            {repo.language}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5" />{repo.stargazers_count}
                        </span>
                        <span className="flex items-center gap-1">
                          <GitFork className="w-3.5 h-3.5" />{repo.forks_count}
                        </span>
                      </div>
                    </div>
                    {repo.topics.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {repo.topics.slice(0, 4).map((topic) => (
                          <Badge key={topic} variant="secondary" className="text-xs">{topic}</Badge>
                        ))}
                      </div>
                    )}
                    <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="w-full gap-1">
                        查看仓库 <ExternalLink className="w-3 h-3" />
                      </Button>
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
