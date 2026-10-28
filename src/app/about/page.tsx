import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { siteInfo } from '@/data/site';
import { Mail, MapPin, GraduationCap } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          {/* 标题区 */}
          <div className="text-center mb-16">
            <div className="seal-stamp mx-auto mb-6" style={{ width: '3rem', height: '3rem', fontSize: '1rem' }}>
              我
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-wider mb-3">{siteInfo.name}</h1>
            <div className="ink-line max-w-xs mx-auto mb-4" />
            <p className="font-serif text-lg text-muted-foreground tracking-wide mb-2">{siteInfo.subtitle}</p>
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground font-serif">
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" />{siteInfo.location}</span>
              <span className="flex items-center gap-1.5"><GraduationCap className="w-4 h-4" />{siteInfo.role}</span>
            </div>
          </div>

          {/* 自述 */}
          <div className="scroll-card mb-10">
            <div className="p-8">
              <h2 className="font-serif text-xl font-semibold tracking-wider mb-5">自述</h2>
              <div className="ink-line max-w-[120px] mb-6" />
              <p className="font-serif text-muted-foreground leading-loose tracking-wide mb-4">
                {siteInfo.description}
              </p>
              <p className="font-serif text-muted-foreground leading-loose tracking-wide">
                目前在北大从事范德华材料转移技术研究（EDL方法），同时对 AI 技术应用充满热情。
                课余时间喜欢踢球、写代码、折腾各种 AI 工具。这个网站就是我记录思考、整理感悟的地方。
              </p>
            </div>
          </div>

          {/* 技能与兴趣 */}
          <div className="grid sm:grid-cols-2 gap-8 mb-10">
            <div className="scroll-card">
              <div className="p-6">
                <h2 className="font-serif text-lg font-semibold tracking-wider mb-4">技术</h2>
                <div className="ink-line max-w-[80px] mb-5" />
                <div className="flex flex-wrap gap-2">
                  {siteInfo.skills.map((skill) => (
                    <span
                      key={skill}
                      className="font-serif text-sm px-3 py-1.5 border border-border rounded text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="scroll-card">
              <div className="p-6">
                <h2 className="font-serif text-lg font-semibold tracking-wider mb-4">兴趣</h2>
                <div className="ink-line max-w-[80px] mb-5" />
                <div className="flex flex-wrap gap-2">
                  {siteInfo.interests.map((interest) => (
                    <span
                      key={interest}
                      className="font-serif text-sm px-3 py-1.5 border border-border rounded text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 联系 */}
          <div className="scroll-card">
            <div className="p-8 text-center">
              <h2 className="font-serif text-xl font-semibold tracking-wider mb-4">联络</h2>
              <div className="ink-line max-w-[120px] mx-auto mb-6" />
              <p className="font-serif text-muted-foreground tracking-wide mb-6">
                欢迎技术交流、学术讨论或合作意向。
              </p>
              <div className="flex justify-center gap-4">
                <a href={`mailto:${siteInfo.email}`}>
                  <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-serif tracking-wider rounded hover:opacity-90 transition-opacity">
                    <Mail className="w-4 h-4" /> 写信
                  </span>
                </a>
                <Link href={siteInfo.github} target="_blank">
                  <span className="inline-flex items-center gap-2 px-5 py-2.5 border border-border text-foreground font-serif tracking-wider rounded hover:bg-muted/50 transition-colors">
                    GitHub
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
