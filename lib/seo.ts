import type { Metadata } from 'next';
import { routing } from '@/i18n/routing';
import { SITE, SOCIALS, phoneE164 } from '@/content/site';
import { CAJS, SKEDIO, type ProjectDates } from '@/content/work';
import { FAQ } from '@/content/faq';
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
// Descriptions are written for the SERP, not reused from `about.bio`: the bio
// is page prose at ~240 chars, well past the ~155 Google renders, so it was
// being truncated mid-sentence. These are sized to survive intact.
const HOME_META: Record<Locale, PageMeta> = {
  sr: {
    title: 'Aleksandar Radivojević — Full-Stack Programer | Leskovac, Srbija',
    description:
      'Full-stack programer iz Leskovca. Pravim sajtove i veb aplikacije koje pomažu biznisima da rastu — prodavnice, zakazivanje i alati po meri.',
  },
  en: {
    title: 'Aleksandar Radivojević — Full-Stack Developer | Leskovac, Serbia',
    description:
      'Full-stack developer in Leskovac, Serbia. I build websites and web apps that help businesses grow — online stores, booking systems, and custom tools.',
  },
};

const PAGE_META: Record<string, Record<Locale, PageMeta>> = {
  '/': HOME_META,
  '/work/optika-cajs': {
    sr: srMessages.caseCajs.meta,
    en: enMessages.caseCajs.meta,
  },
  '/work/skedio': {
    sr: srMessages.caseSkedio.meta,
    en: enMessages.caseSkedio.meta,
  },
};

const OG_LOCALE: Record<Locale, string> = {
  sr: 'sr_RS',
  en: 'en_US',
};

// The message catalogs, keyed by locale. Structured data is built on the server
// from these directly rather than through next-intl's `useTranslations`, which
// is a React hook and unavailable in the plain functions below.
const MESSAGES: Record<Locale, typeof enMessages> = {
  sr: srMessages,
  en: enMessages,
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

// Stable node id for the Person entity. Every other schema block that needs to
// say "Alex made this" references this id instead of restating name/url/sameAs,
// so search engines merge them into one node in the graph rather than treating
// each page's author as a separate, unconnected person.
export const PERSON_ID = `${SITE_ORIGIN}/#person`;

/** Person JSON-LD — no price/offer fields (confidential rule). */
export function personJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': PERSON_ID,
    name: SITE.name,
    email: `mailto:${SITE.email}`,
    telephone: phoneE164(),
    url: SITE_ORIGIN,
    jobTitle: 'Full-Stack Developer',
    // Stated in the About copy too, but prose is invisible to search engines
    // and AI systems as a *credential*. This makes it a typed edge to a real
    // institution, which is the kind of corroboration E-E-A-T rewards.
    //
    // `affiliation`, not `alumniOf`: schema.org's alumniOf means someone who
    // graduated from the institution. This is an in-progress master's, and the
    // bachelor's was earned elsewhere — so alumniOf would be a false claim.
    affiliation: {
      '@type': 'CollegeOrUniversity',
      name: 'Faculty of Electronic Engineering, University of Niš',
      url: 'https://www.elfak.ni.ac.rs/',
      parentOrganization: {
        '@type': 'CollegeOrUniversity',
        name: 'University of Niš',
        url: 'https://www.ni.ac.rs/',
      },
    },
    // Identity corroboration: these tie the Person entity to profiles search
    // engines already know, which is what disambiguates one Aleksandar
    // Radivojević from another. Same list the footer links visibly.
    sameAs: SOCIALS.map((s) => s.href),
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

/**
 * BreadcrumbList JSON-LD for a case-study page.
 *
 * Two levels, not three: there is no `/work` index route (the Work section is
 * an anchor on the home page, which is why the case-study back-link reads
 * "Back to work"). An intermediate "Work" crumb would have to point at a URL
 * that doesn't exist, and Google drops the whole breadcrumb when a listed item
 * 404s — so Home → case study is both the honest and the surviving shape.
 */
export function breadcrumbJsonLd(locale: Locale, path: string) {
  const m = MESSAGES[locale];
  const name = path === `/work/${CAJS.slug}` ? m.work.cajs.title : m.work.skedio.title;

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        // SITE.name, not a "Home"/"Početna" label: there is no such string in
        // the message catalogs, and inventing one would put untranslated UI
        // copy in two places. On a personal site the root *is* the person, so
        // the name is the accurate crumb — and it needs no translation.
        '@type': 'ListItem',
        position: 1,
        name: SITE.name,
        item: buildLocalizedUrl(locale, '/'),
      },
      {
        '@type': 'ListItem',
        position: 2,
        name,
        item: buildLocalizedUrl(locale, path),
      },
    ],
  };
}

/**
 * FAQPage JSON-LD for the services FAQ on the home page.
 *
 * NOTE ON EXPECTATIONS: this will not produce a rich result. Google restricted
 * FAQ rich results to government and health authority sites in August 2023, and
 * alexrad.dev is neither. It's emitted anyway because the markup is still valid
 * and still parsed — it makes the Q&A block cleanly extractable for AI Overviews,
 * ChatGPT and Perplexity, which is where the remaining value is. Don't "fix" the
 * absence of an expandable SERP entry; that's expected.
 *
 * Questions and answers are read from the same message catalog the accordion
 * renders, so the markup can't drift from the visible copy — which is also
 * Google's requirement for FAQ markup.
 */
export function faqJsonLd(locale: Locale) {
  const faq = MESSAGES[locale].services.faq;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((entry) => ({
      '@type': 'Question',
      name: faq[entry.id].question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq[entry.id].answer,
      },
    })),
  };
}

// Per-path case-study facts. Pulls from content/work.ts so the schema can't
// claim a stack or a live URL the Work section doesn't also show.
const CASE_STUDIES: Record<string, { titleKey: 'cajs' | 'skedio'; live?: string; stack: string[]; dates?: ProjectDates }> = {
  [`/work/${CAJS.slug}`]: {
    titleKey: 'cajs',
    live: CAJS.live,
    stack: CAJS.stack,
    dates: CAJS.dates,
  },
  '/work/skedio': {
    titleKey: 'skedio',
    live: SKEDIO.live,
    stack: SKEDIO.stack,
    dates: SKEDIO.dates,
  },
};

/**
 * Last-modified date for a path, for the sitemap.
 *
 * Returns undefined for anything without a real date on record, so the caller
 * decides the fallback rather than this silently inventing one.
 */
export function pathLastModified(path: string): Date | undefined {
  const dates = CASE_STUDIES[path]?.dates;
  if (!dates) return undefined;
  return new Date(dates.modified ?? dates.published);
}

/**
 * CreativeWork JSON-LD describing the project a case-study page is about.
 *
 * `author` is a bare reference to PERSON_ID rather than an inline Person: the
 * full Person node is already emitted once in the layout, so repeating it here
 * would create a second, competing description of the same entity.
 *
 * Every optional field is omitted rather than emptied when its source data is
 * missing. An empty `keywords: ""` or a `url: undefined` is worse than silence —
 * it's a claim that the value is nothing.
 */
export function caseStudyJsonLd(locale: Locale, path: string) {
  const study = CASE_STUDIES[path];
  if (!study) return null;

  const m = MESSAGES[locale];
  const copy = m.work[study.titleKey];
  const canonical = buildLocalizedUrl(locale, path);

  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    '@id': `${canonical}#project`,
    name: copy.title,
    description: copy.summary,
    author: { '@id': PERSON_ID },
    creator: { '@id': PERSON_ID },
    inLanguage: locale,
    mainEntityOfPage: canonical,
    ...(study.stack.length > 0 && { keywords: study.stack.join(', ') }),
    ...(study.live && { url: study.live }),
    ...(study.dates?.published && { datePublished: study.dates.published }),
    ...(study.dates?.modified && { dateModified: study.dates.modified }),
  };
}

