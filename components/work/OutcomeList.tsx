import { useTranslations } from 'next-intl';
import { Reveal } from '@/components/ui/Reveal';
import { CAJS } from '@/content/work';

export function OutcomeList() {
  const t = useTranslations('caseCajs.outcomes');

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {CAJS.outcomes.map((key, i) => (
        <Reveal key={key} delay={i * 0.05}>
          <div className="flex h-full flex-col gap-3 border border-line p-6">
            <span className="font-mono text-xs text-accent">{String(i + 1).padStart(2, '0')}</span>
            <h3 className="font-display text-lg text-fg sm:text-xl">{t(`${key}.title`)}</h3>
            <p className="text-sm text-muted sm:text-base">{t(`${key}.body`)}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
