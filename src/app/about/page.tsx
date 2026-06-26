import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { siteInfo } from '@/data/site';
import { Mail, Github, MapPin, GraduationCap, Heart } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Profile */}
          <div className="text-center mb-16">
            <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl font-bold text-primary">B</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">{siteInfo.name}</h1>
            <p className="text-xl text-muted-foreground mb-2">{siteInfo.subtitle}</p>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mb-6">
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{siteInfo.location}</span>
              <span className="flex items-center gap-1"><GraduationCap className="w-4 h-4" />{siteInfo.role}</span>
            </div>
            <div className="flex justify-center gap-3">
              <a href={siteInfo.github} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="gap-2">
                  <Github className="w-4 h-4" /> GitHub
                </Button>
              </a>
              <a href={`mailto:${siteInfo.email}`}>
                <Button variant="outline" className="gap-2">
                  <Mail className="w-4 h-4" /> 邮箱
                </Button>
              </a>
            </div>
          </div>

          {/* Bio */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">关于我</h2>
              <p className="text-muted-foreground leading-relaxed">
                {siteInfo.description}
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                目前在北大从事范德华材料转移技术研究（EDL方法），同时对 AI 技术应用充满热情。
                课余时间喜欢踢球、写代码、折腾各种 AI 工具。这个网站就是我探索技术世界的一个窗口。
              </p>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Skills */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">技术技能</h2>
                <div className="flex flex-wrap gap-2">
                  {siteInfo.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="px-3 py-1.5">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Interests */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">兴趣方向</h2>
                <div className="flex flex-wrap gap-2">
                  {siteInfo.interests.map((interest) => (
                    <Badge key={interest} variant="secondary" className="px-3 py-1.5">
                      <Heart className="w-3 h-3 mr-1" /> {interest}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact */}
          <Card className="mt-8">
            <CardContent className="p-6 text-center">
              <h2 className="text-xl font-semibold mb-2">联系我</h2>
              <p className="text-muted-foreground mb-4">
                欢迎技术交流、学术讨论或合作意向。
              </p>
              <div className="flex justify-center gap-3">
                <a href={`mailto:${siteInfo.email}`}>
                  <Button className="gap-2">
                    <Mail className="w-4 h-4" /> 发送邮件
                  </Button>
                </a>
                <Link href={siteInfo.github} target="_blank">
                  <Button variant="outline" className="gap-2">
                    <Github className="w-4 h-4" /> GitHub
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
