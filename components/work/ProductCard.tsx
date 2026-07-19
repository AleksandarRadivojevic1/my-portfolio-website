import { useTranslations } from 'next-intl';
import { Tag } from '@/components/ui/Tag';
import { SKEDIO } from '@/content/work';

export function ProductCard() {
  const t = useTranslations('work.skedio');
  const liveHref = SKEDIO.live ?? SKEDIO.landing;

  return (
    <div className="flex h-full flex-col gap-4 border border-line p-6">
      <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
        {t('label')}
      </span>
      <h3 className="font-display text-xl text-fg sm:text-2xl">{t('title')}</h3>
      <p className="text-sm text-muted sm:text-base">{t('summary')}</p>
      {SKEDIO.stack.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {SKEDIO.stack.map((tech) => (
            <Tag key={tech}>{tech}</Tag>
          ))}
        </div>
      )}
      {liveHref && (
        <a
          href={liveHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto inline-flex items-center gap-1 font-mono text-sm text-fg transition-colors hover:text-accent"
        >
          {t('liveLabel')} →
        </a>
      )}
    </div>
  );
}
