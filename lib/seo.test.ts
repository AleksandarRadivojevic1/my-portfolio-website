import {
  buildMetadata,
  localBusinessJsonLd,
  personJsonLd,
  breadcrumbJsonLd,
  faqJsonLd,
  caseStudyJsonLd,
  pathLastModified,
  PERSON_ID,
} from './seo';
import enMessages from '@/messages/en.json';

test('hreflang alternates for both locales', () => {
  const m = buildMetadata('sr', '/');
  expect(m.alternates?.languages).toHaveProperty('sr');
  expect(m.alternates?.languages).toHaveProperty('en');
});

test('localbusiness schema names Leskovac', () => {
  expect(JSON.stringify(localBusinessJsonLd())).toMatch(/Leskovac/);
});

test('buildMetadata resolves the Skedio case-study page', () => {
  const meta = buildMetadata('en', '/work/skedio');
  expect(meta.title).toBe(enMessages.caseSkedio.meta.title);
  expect(meta.alternates?.canonical).toBe('https://alexrad.dev/en/work/skedio');
});

test('breadcrumb is two levels with absolute, locale-correct urls', () => {
  const crumbs = breadcrumbJsonLd('sr', '/work/optika-cajs');
  expect(crumbs.itemListElement).toHaveLength(2);
  expect(crumbs.itemListElement[0].item).toBe('https://alexrad.dev/sr');
  expect(crumbs.itemListElement[1].item).toBe('https://alexrad.dev/sr/work/optika-cajs');
  expect(crumbs.itemListElement[1].name).toBe('Optika Cajs');
});

// Google requires FAQ markup to match the copy actually rendered on the page.
// Drift here is invisible in the UI, so it's worth a test.
test('faq schema mirrors the rendered question copy', () => {
  const faq = faqJsonLd('en');
  expect(faq.mainEntity).toHaveLength(3);
  expect(faq.mainEntity[0].name).toBe(enMessages.services.faq.social.question);
  expect(faq.mainEntity[0].acceptedAnswer.text).toBe(enMessages.services.faq.social.answer);
});

test('case study credits the one Person node rather than inlining a second', () => {
  const work = caseStudyJsonLd('en', '/work/optika-cajs');
  expect(work?.author).toEqual({ '@id': PERSON_ID });
  expect(personJsonLd()['@id']).toBe(PERSON_ID);
});

// Skedio has no live URL and an empty stack in content/work.ts. Those fields
// must be absent, not present-and-empty — an empty string is a claim.
test('case study omits fields with no source data instead of emptying them', () => {
  const work = caseStudyJsonLd('en', '/work/skedio') as Record<string, unknown>;
  expect(work).not.toHaveProperty('url');
  expect(work).not.toHaveProperty('keywords');
  expect(work.name).toBe('Skedio');
});

test('caseStudyJsonLd returns null for a path that is not a case study', () => {
  expect(caseStudyJsonLd('en', '/')).toBeNull();
});

// Dates are public claims about when work shipped, and both were wrong once —
// derived from git and Vercel history before Search Console showed the real
// go-live. Pin them to the GSC-backed values so a careless edit has to be
// deliberate. See the provenance comments in content/work.ts before changing.
test('case study dates are ISO 8601 and only present where recorded', () => {
  const cajs = caseStudyJsonLd('en', '/work/optika-cajs') as Record<string, unknown>;
  expect(cajs.datePublished).toBe('2026-07-07');
  expect(cajs.dateModified).toBe('2026-07-18');

  const skedio = caseStudyJsonLd('en', '/work/skedio') as Record<string, unknown>;
  expect(skedio.datePublished).toBe('2026-05-05');
  expect(skedio.dateModified).toBe('2026-06-08');
});

// A project cannot have been modified before it was published.
test('every recorded modified date is at or after its published date', () => {
  for (const path of ['/work/optika-cajs', '/work/skedio']) {
    const w = caseStudyJsonLd('en', path) as unknown as Record<string, string>;
    if (w.dateModified) expect(w.dateModified >= w.datePublished).toBe(true);
  }
});

test('sitemap lastModified uses project dates, not build time', () => {
  expect(pathLastModified('/work/skedio')?.toISOString().slice(0, 10)).toBe('2026-06-08');
  expect(pathLastModified('/work/optika-cajs')?.toISOString().slice(0, 10)).toBe('2026-07-18');
  // The home page has no project date of its own — caller falls back.
  expect(pathLastModified('/')).toBeUndefined();
});
