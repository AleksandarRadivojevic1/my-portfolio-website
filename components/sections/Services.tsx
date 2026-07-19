import { useTranslations } from 'next-intl';
import { SectionCounter } from '@/components/ui/SectionCounter';
import { Reveal } from '@/components/ui/Reveal';
import { BracketButton } from '@/components/ui/BracketButton';
import { CompareTable } from '@/components/services/CompareTable';
import { PackageCard } from '@/components/services/PackageCard';
import { ProcessSteps } from '@/components/services/ProcessSteps';
import { Faq } from '@/components/services/Faq';
import { PACKAGES, MAINTENANCE } from '@/content/services';

const MAINTENANCE_ROWS = ['site', 'app'] as const;

export function Services() {
  const t = useTranslations('services');

  return (
    <section id="services" className="relative px-6 py-32">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-16">
        <SectionCounter index={3} labelKey="sections.services" />

        <p className="max-w-2xl text-base text-fg sm:text-lg">{t('intro')}</p>

        <div className="flex flex-col gap-6">
          <h3 className="font-display text-xl text-fg sm:text-2xl">{t('compare.title')}</h3>
          <CompareTable />
        </div>

        <div className="flex flex-col gap-6">
          <h3 className="font-display text-xl text-fg sm:text-2xl">{t('packages.title')}</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PACKAGES.map((pkg, i) => (
              <Reveal key={pkg.id} delay={i * 0.1}>
                <PackageCard pkg={pkg} />
              </Reveal>
            ))}
          </div>
          <p className="max-w-2xl text-sm text-muted">{t('packages.note')}</p>
        </div>

        <div className="flex flex-col gap-6">
          <h3 className="font-display text-xl text-fg sm:text-2xl">{t('maintenance.title')}</h3>
          <p className="max-w-2xl text-sm text-muted sm:text-base">{t('maintenance.tagline')}</p>
          <div className="overflow-x-auto border border-line">
            <table className="w-full min-w-[24rem] border-collapse text-left">
              <thead>
                <tr className="border-b border-line">
                  <th
                    scope="col"
                    className="p-4 font-mono text-xs uppercase tracking-[0.2em] text-muted"
                  >
                    {t('maintenance.tier')}
                  </th>
                  <th
                    scope="col"
                    className="p-4 font-mono text-xs uppercase tracking-[0.2em] text-muted"
                  >
                    {t('maintenance.month')}
                  </th>
                  <th
                    scope="col"
                    className="p-4 font-mono text-xs uppercase tracking-[0.2em] text-muted"
                  >
                    {t('maintenance.year')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {MAINTENANCE_ROWS.map((key) => (
                  <tr key={key} className="border-b border-line last:border-b-0">
                    <th scope="row" className="p-4 text-sm font-normal text-fg sm:text-base">
                      {t(`maintenance.${key}`)}
                    </th>
                    <td className="p-4 font-mono text-fg">{MAINTENANCE[key].month}</td>
                    <td className="p-4 font-mono text-fg">{MAINTENANCE[key].year}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <h3 className="font-display text-xl text-fg sm:text-2xl">{t('process.title')}</h3>
          <ProcessSteps />
        </div>

        <div className="flex flex-col gap-6">
          <h3 className="font-display text-xl text-fg sm:text-2xl">{t('faq.title')}</h3>
          <Faq />
        </div>

        <div>
          <BracketButton href="#contact">{t('cta')}</BracketButton>
        </div>
      </div>
    </section>
  );
}
