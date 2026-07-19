import { useTranslations } from 'next-intl';

const ROW_KEYS = ['does', 'visitor', 'gets', 'example', 'scope'] as const;

export function CompareTable() {
  const t = useTranslations('services.compare');

  return (
    <div className="overflow-x-auto border border-line">
      <table className="w-full min-w-[36rem] border-collapse text-left">
        <thead>
          <tr className="border-b border-line">
            <th scope="col" className="p-4">
              <span className="sr-only">{t('title')}</span>
            </th>
            <th
              scope="col"
              className="p-4 font-display text-base font-normal text-fg sm:text-lg"
            >
              {t('site')}
            </th>
            <th
              scope="col"
              className="p-4 font-display text-base font-normal text-fg sm:text-lg"
            >
              {t('app')}
            </th>
          </tr>
        </thead>
        <tbody>
          {ROW_KEYS.map((key) => (
            <tr key={key} className="border-b border-line last:border-b-0">
              <th
                scope="row"
                className="p-4 align-top font-mono text-xs font-normal uppercase tracking-wide text-muted"
              >
                {t(`rows.${key}.label`)}
              </th>
              <td className="p-4 align-top text-sm text-muted sm:text-base">
                {t(`rows.${key}.site`)}
              </td>
              <td className="p-4 align-top text-sm text-fg sm:text-base">
                {t(`rows.${key}.app`)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
