import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { tools, categoryMeta, type Tool } from '@/data/tools';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExternalLink, Wrench } from 'lucide-react';

const categories = Object.keys(categoryMeta) as Tool['category'][];

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <h1 className="text-4xl font-bold tracking-tight mb-3">AI 工具集</h1>
            <p className="text-muted-foreground">
              我日常使用和推荐的 AI 工具合集，涵盖大模型、编程、效率和多模态领域。
            </p>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-8 flex-wrap h-auto gap-1 bg-transparent">
              <TabsTrigger value="all" className="rounded-lg">全部</TabsTrigger>
              {categories.map((cat) => (
                <TabsTrigger key={cat} value={cat} className="rounded-lg">
                  {categoryMeta[cat].emoji} {categoryMeta[cat].label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="all">
              <ToolGrid tools={tools} />
            </TabsContent>
            {categories.map((cat) => (
              <TabsContent key={cat} value={cat}>
                <ToolGrid tools={tools.filter((t) => t.category === cat)} />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function ToolGrid({ tools }: { tools: Tool[] }) {
  if (tools.length === 0) {
    return (
      <Card className="p-12 text-center">
        <Wrench className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">该分类下暂无工具。</p>
      </Card>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tools.map((tool) => (
        <Card key={tool.name} className="hover:shadow-md hover:border-primary/30 transition-all duration-200 flex flex-col">
          <CardContent className="p-5 flex-1 flex flex-col">
            <h3 className="font-semibold text-lg mb-2">{tool.name}</h3>
            <p className="text-sm text-muted-foreground flex-1 mb-4">{tool.description}</p>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {tool.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
              ))}
            </div>
            <a href={tool.url} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="w-full gap-1">
                访问 <ExternalLink className="w-3 h-3" />
              </Button>
            </a>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
