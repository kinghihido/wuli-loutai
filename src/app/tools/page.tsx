import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { tools, categoryMeta, type Tool } from '@/data/tools';
import { ExternalLink } from 'lucide-react';

const categories = Object.keys(categoryMeta) as Tool['category'][];

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          {/* 标题区 */}
          <div className="text-center mb-12">
            <div className="seal-stamp mx-auto mb-6" style={{ width: '3rem', height: '3rem', fontSize: '1rem' }}>
              器
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-wider mb-3">工具</h1>
            <div className="ink-line max-w-xs mx-auto mb-4" />
            <p className="font-serif text-muted-foreground tracking-wide">
              日常使用的 AI 工具合集
            </p>
          </div>

          {/* 按分类展示 */}
          {categories.map((cat) => {
            const catTools = tools.filter(t => t.category === cat);
            if (catTools.length === 0) return null;
            return (
              <div key={cat} className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-xl">{categoryMeta[cat].emoji}</span>
                  <h2 className="font-serif text-xl font-semibold tracking-wider">{categoryMeta[cat].label}</h2>
                  <div className="flex-1 ink-line" />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {catTools.map((tool) => (
                    <div key={tool.name} className="scroll-card group hover:border-primary/30 transition-all duration-200">
                      <div className="p-5 flex flex-col h-full">
                        <h3 className="font-serif font-semibold tracking-wide mb-2 group-hover:text-primary transition-colors">
                          {tool.name}
                        </h3>
                        <p className="font-serif text-sm text-muted-foreground flex-1 mb-4 leading-relaxed">
                          {tool.description}
                        </p>
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {tool.tags.map((tag) => (
                            <span
                              key={tag}
                              className="font-serif text-xs px-2 py-0.5 border border-border rounded text-muted-foreground"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <a href={tool.url} target="_blank" rel="noopener noreferrer">
                          <span className="inline-flex items-center gap-2 w-full justify-center px-4 py-2 border border-border rounded font-serif text-sm tracking-wider text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors">
                            访问 <ExternalLink className="w-3 h-3" />
                          </span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
}
