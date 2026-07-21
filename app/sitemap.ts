import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { SITE_ORIGIN, pathLastModified } from '@/lib/seo';

const PATHS = ['/', '/work/optika-cajs', '/work/skedio'];

// This file is prerendered, so `new Date()` resolves at build time, not per
// request — it means "this deploy", which is the honest answer for the home
// page. The case-study pages get their project's real date instead: stamping
// every URL with the build time tells Google all six changed on every deploy,
// which is the fastest way to make lastModified a signal it ignores.
const BUILD_TIME = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  return PATHS.flatMap((path) => {
    const suffix = path === '/' ? '' : path;
    const lastModified = pathLastModified(path) ?? BUILD_TIME;
    const languages: Record<string, string> = {};
    for (const loc of routing.locales) {
      languages[loc] = `${SITE_ORIGIN}/${loc}${suffix}`;
    }

    return routing.locales.map((locale) => ({
      url: `${SITE_ORIGIN}/${locale}${suffix}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: path === '/' ? 1 : 0.8,
      alternates: { languages },
    }));
  });
}
