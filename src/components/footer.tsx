import { Terminal } from 'lucide-react';

export function Footer() {
  return (
    <footer className="py-8 px-6 border-t border-border">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center">
            <Terminal className="w-3 h-3 text-primary" />
          </div>
          <span>Black Geek</span>
        </div>
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Black. Built with Next.js & Tailwind.
        </p>
      </div>
    </footer>
  );
}
