import { useTranslations } from 'next-intl';
import { CAJS } from '@/content/work';
import type { CaseStudyStats } from '@/content/work';

const STAT_KEYS: Array<keyof CaseStudyStats> = ['pages', 'loc', 'tests', 'marketValue', 'effort'];

export function StatGrid() {
  const t = useTranslations('caseCajs.stats');

  return (
    <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {STAT_KEYS.map((key) => (
        <div key={key} className="flex flex-col gap-2 border border-line p-4">
          <dd className="font-mono text-lg text-fg sm:text-xl">{CAJS.stats[key]}</dd>
          <dt className="font-mono text-xs uppercase tracking-[0.2em] text-muted">{t(key)}</dt>
        </div>
      ))}
    </dl>
  );
}
