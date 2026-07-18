'use client';

import { Link, usePathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

type LocaleToggleProps = {
  current: string;
};

export function LocaleToggle({ current }: LocaleToggleProps) {
  const pathname = usePathname();

  return (
    <span className="font-mono text-xs uppercase tracking-[0.2em]">
      [{' '}
      {routing.locales.map((locale, index) => {
        const isActive = locale === current;
        return (
          <span key={locale}>
            {index > 0 && ' | '}
            <Link
              href={pathname}
              locale={locale}
              aria-current={isActive ? 'true' : undefined}
              className={isActive ? 'text-fg' : 'text-muted transition-colors hover:text-accent'}
            >
              {locale.toUpperCase()}
            </Link>
          </span>
        );
      })}
      {' ]'}
    </span>
  );
}
