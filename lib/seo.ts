import type { Metadata } from 'next';
import { routing } from '@/i18n/routing';
import { SITE } from '@/content/site';
import srMessages from '@/messages/sr.json';
import enMessages from '@/messages/en.json';

// Single source of truth for the production origin. Do not hardcode the
// host anywhere else — import SITE_ORIGIN instead.
export const SITE_ORIGIN = `https://${SITE.domain}`;

export type Locale = (typeof routing.locales)[number];

type PageMeta = { title: string; description: string };

// Per-locale, per-path SEO copy. Metadata title/description are allowed to
// live outside messages/*.json (they're not visible UI copy), but the
// case-study entry is pulled straight from the message catalog so the
// <title> stays in sync with the page's own copy.
const HOME_META: Record<Locale, PageMeta> = {
  sr: {
    title: 'Aleksandar Radivojević — Fulstek Programer | Leskovac, Srbija',
    description: srMessages.about.bio,
  },
  en: {
    title: 'Aleksandar Radivojević — Full-Stack Developer | Leskovac, Serbia',
    description: enMessages.about.bio,
  },
};

const PAGE_META: Record<string, Record<Locale, PageMeta>> = {
  '/': HOME_META,
  '/work/optika-cajs': {
    sr: srMessages.caseCajs.meta,
    en: enMessages.caseCajs.meta,
  },
};

const OG_LOCALE: Record<Locale, string> = {
  sr: 'sr_RS',
  en: 'en_US',
};

function buildLocalizedUrl(locale: Locale, path: string): string {
  const suffix = path === '/' ? '' : path;
  return `${SITE_ORIGIN}/${locale}${suffix}`;
}

/** Builds per-locale Metadata (title, description, canonical, hreflang) for a given app path. */
export function buildMetadata(locale: Locale, path: string): Metadata {
  const page = PAGE_META[path] ?? HOME_META;
  const { title, description } = page[locale];

  const languages: Record<string, string> = {};
  for (const loc of routing.locales) {
    languages[loc] = buildLocalizedUrl(loc, path);
  }
  languages['x-default'] = buildLocalizedUrl(routing.defaultLocale, path);

  const canonical = buildLocalizedUrl(locale, path);

  return {
    metadataBase: new URL(SITE_ORIGIN),
    title,
    description,
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE.domain,
      locale: OG_LOCALE[locale],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

/** Person JSON-LD — no price/offer fields (confidential rule). */
export function personJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: SITE.name,
    email: `mailto:${SITE.email}`,
    telephone: phoneE164(),
    url: SITE_ORIGIN,
    jobTitle: 'Full-Stack Developer',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Leskovac',
      addressCountry: 'RS',
    },
  };
}

/** LocalBusiness JSON-LD — Leskovac-based, no price/offer fields (confidential rule). */
export function localBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: SITE.name,
    email: SITE.email,
    telephone: phoneE164(),
    url: SITE_ORIGIN,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Leskovac',
      addressCountry: 'RS',
    },
    areaServed: [
      { '@type': 'City', name: 'Leskovac' },
      { '@type': 'Country', name: 'Serbia' },
    ],
  };
}

// SITE.phone is stored as a local Serbian number ("061 230 8522") for
// display; JSON-LD wants an E.164-ish absolute form.
function phoneE164(): string {
  return `+381${SITE.phone.replace(/^0/, '').replace(/\s+/g, '')}`;
}
