import { buildMetadata, localBusinessJsonLd } from './seo';
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
