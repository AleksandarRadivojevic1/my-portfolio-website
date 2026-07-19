import { useTranslations } from 'next-intl';
import { FAQ } from '@/content/faq';

export function Faq() {
  const t = useTranslations('services.faq');

  return (
    <div className="flex flex-col divide-y divide-line border border-line">
      {FAQ.map((entry) => (
        <details key={entry.id} className="group p-6">
          <summary className="cursor-pointer list-none font-display text-base text-fg marker:content-none sm:text-lg">
            {t(`${entry.id}.question`)}
          </summary>
          <p className="mt-3 text-sm text-muted sm:text-base">{t(`${entry.id}.answer`)}</p>
        </details>
      ))}
    </div>
  );
}
