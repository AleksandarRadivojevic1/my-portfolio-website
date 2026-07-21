import { hasLocale } from 'next-intl';
import { routing } from '@/i18n/routing';
import { OG_CONTENT_TYPE, OG_SIZE, renderOgCard } from '@/lib/og';

export const alt = 'Optika Cajs — online store and lens configurator · Case study';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = hasLocale(routing.locales, rawLocale) ? rawLocale : routing.defaultLocale;

  return renderOgCard({
    eyebrow: locale === 'sr' ? 'Studija slučaja' : 'Case study',
    title: 'Optika Cajs',
    subtitle:
      locale === 'sr'
        ? 'Prodavnica i konfigurator dioptrijskih stakala'
        : 'Online store and lens configurator',
  });
}
