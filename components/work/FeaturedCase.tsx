import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Tag } from '@/components/ui/Tag';
import { BracketButton } from '@/components/ui/BracketButton';
import { CAJS } from '@/content/work';

export function FeaturedCase() {
  const t = useTranslations('work.cajs');

  return (
    <div className="flex flex-col gap-6 border border-line p-8 sm:p-10">
      <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
        {t('role')}
      </span>
      <h3 className="font-display text-3xl text-fg sm:text-4xl">{t('title')}</h3>
      <p className="max-w-2xl text-base text-muted sm:text-lg">{t('summary')}</p>
      <div className="flex flex-wrap gap-2">
        {CAJS.stack.map((tech) => (
          <Tag key={tech}>{tech}</Tag>
        ))}
      </div>
      <div>
        <BracketButton as={Link} href={`/work/${CAJS.slug}`}>
          {t('cta')}
        </BracketButton>
      </div>
    </div>
  );
}
