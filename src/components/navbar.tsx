'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  BookOpen,
  Wrench,
  FolderGit2,
  User,
} from 'lucide-react';

const navItems = [
  { href: '/', label: '序', fullLabel: '序章', icon: null },
  { href: '/blog', label: '文', fullLabel: '文章', icon: BookOpen },
  { href: '/tools', label: '器', fullLabel: '工具', icon: Wrench },
  { href: '/projects', label: '作', fullLabel: '项目', icon: FolderGit2 },
  { href: '/about', label: '我', fullLabel: '关于', icon: User },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* 站名 — 仿印章 */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="seal-stamp group-hover:scale-105 transition-transform">
            雾
          </div>
          <span className="font-serif font-semibold text-lg tracking-widest hidden sm:inline">
            雾里楼台
          </span>
        </Link>

        {/* 桌面端导航 — 仿古籍目录 */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-1.5 px-4 py-2 rounded text-sm font-serif tracking-wider transition-all',
                  isActive
                    ? 'text-primary bg-primary/8'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                )}
              >
                <span className="font-semibold">{item.label}</span>
                <span className="text-xs opacity-60 hidden lg:inline">{item.fullLabel}</span>
              </Link>
            );
          })}
        </div>

        {/* 移动端导航 */}
        <div className="flex md:hidden items-center gap-0.5">
          {navItems.map((item) => {
            const isActive = item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'w-9 h-9 flex items-center justify-center rounded text-sm font-serif transition-all',
                  isActive
                    ? 'text-primary bg-primary/8'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
