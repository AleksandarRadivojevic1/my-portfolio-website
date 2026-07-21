import { hasLocale } from 'next-intl';
import { routing } from '@/i18n/routing';
import { OG_CONTENT_TYPE, OG_SIZE, renderOgCard } from '@/lib/og';

export const alt = 'Skedio — scheduling and CRM SaaS · Case study';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = hasLocale(routing.locales, rawLocale) ? rawLocale : routing.defaultLocale;

  return renderOgCard({
    eyebrow: locale === 'sr' ? 'Studija slučaja' : 'Case study',
    title: 'Skedio',
    subtitle:
      locale === 'sr'
        ? 'SaaS za zakazivanje i CRM'
        : 'Scheduling and CRM SaaS',
  });
}
