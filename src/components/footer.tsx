import Link from 'next/link';

export function Footer() {
  return (
    <footer className="py-10 px-6 border-t border-border">
      <div className="max-w-5xl mx-auto">
        <div className="ink-line mb-6" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="seal-stamp" style={{ width: '2rem', height: '2rem', fontSize: '0.7rem' }}>
              染
            </div>
            <span className="font-serif text-sm tracking-wider text-muted-foreground">
              层林尽染
            </span>
          </div>
          <p className="font-serif text-sm text-muted-foreground tracking-wide">
            &copy; {new Date().getFullYear()} &middot; 万山红遍，层林尽染
          </p>
          <Link
            href="https://github.com/kinghihido/wuli-loutai"
            target="_blank"
            className="text-xs text-muted-foreground hover:text-primary transition-colors font-serif"
          >
            源码
          </Link>
        </div>
      </div>
    </footer>
  );
}
