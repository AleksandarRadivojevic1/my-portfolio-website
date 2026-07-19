import { useTranslations } from 'next-intl';
import { PROCESS_STEPS } from '@/content/services';

export function ProcessSteps() {
  const t = useTranslations('services.process');

  return (
    <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {PROCESS_STEPS.map((step) => (
        <li key={step.id} className="flex flex-col gap-3 border border-line p-6">
          <span className="font-mono text-xs text-muted">
            {String(step.step).padStart(2, '0')}
          </span>
          <h4 className="font-display text-lg text-fg">{t(`${step.id}.title`)}</h4>
          <p className="text-sm text-muted">{t(`${step.id}.body`)}</p>
        </li>
      ))}
    </ol>
  );
}
