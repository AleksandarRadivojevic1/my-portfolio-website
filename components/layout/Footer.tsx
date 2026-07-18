import { SITE } from '@/content/site';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line px-6 py-12 pb-16 font-mono text-xs text-muted">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <span>{SITE.domain}</span>
        <a href={`mailto:${SITE.email}`} className="transition-colors hover:text-accent">
          {SITE.email}
        </a>
        <a href={`tel:${SITE.phone.replace(/\s+/g, '')}`} className="transition-colors hover:text-accent">
          {SITE.phone}
        </a>
        <span>{SITE.location}</span>
        <span>&copy; {year}</span>
      </div>
    </footer>
  );
}
