import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { SITE_ORIGIN } from '@/lib/seo';

const PATHS = ['/', '/work/optika-cajs'];

export default function sitemap(): MetadataRoute.Sitemap {
  return PATHS.flatMap((path) => {
    const suffix = path === '/' ? '' : path;
    const languages: Record<string, string> = {};
    for (const loc of routing.locales) {
      languages[loc] = `${SITE_ORIGIN}/${loc}${suffix}`;
    }

    return routing.locales.map((locale) => ({
      url: `${SITE_ORIGIN}/${locale}${suffix}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: path === '/' ? 1 : 0.8,
      alternates: { languages },
    }));
  });
}
