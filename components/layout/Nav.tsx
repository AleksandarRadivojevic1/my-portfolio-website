import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { LocaleToggle } from './LocaleToggle';

type NavProps = {
  locale: string;
};

export function Nav({ locale }: NavProps) {
  const t = useTranslations('nav');

  // Home-anchored (`/#id`), not bare `#id`: bare hashes resolve against the
  // *current* path, so from a `/work/...` route they'd produce
  // `/work/optika-cajs#work` and go nowhere. Routing to the localized home +
  // hash makes each link work from any page — as a client-side navigation.
  const links: Array<{ href: string; label: string }> = [
    { href: '/#about', label: t('about') },
    { href: '/#work', label: t('work') },
    { href: '/#services', label: t('services') },
    { href: '/#contact', label: t('contact') },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-bg/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-mono text-sm font-bold tracking-[0.2em] text-fg">
          AR
        </Link>
        <ul className="hidden items-center gap-8 font-mono text-xs uppercase tracking-[0.2em] text-muted sm:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="transition-colors hover:text-accent">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <LocaleToggle current={locale} />
      </nav>
    </header>
  );
}
