import { useTranslations } from 'next-intl';
import type { Package } from '@/content/services';

type PackageCardProps = {
  pkg: Package;
};

export function PackageCard({ pkg }: PackageCardProps) {
  const t = useTranslations('services.packages');

  return (
    <div className="flex h-full flex-col gap-4 border border-line p-6">
      <span className="font-mono text-sm uppercase tracking-wide text-fg">
        {t(`${pkg.verticalsKey}.name`)}
      </span>
      <p className="text-sm text-muted sm:text-base">
        <span className="font-mono text-xs uppercase tracking-wide text-fg">
          {t('includesLabel')}:{' '}
        </span>
        {t(`${pkg.verticalsKey}.includes`)}
      </p>
      <p className="text-sm text-muted">{t(`${pkg.verticalsKey}.idealFor`)}</p>
      <span className="mt-auto font-mono text-2xl text-accent sm:text-3xl">{pkg.priceLabel}</span>
    </div>
  );
}
