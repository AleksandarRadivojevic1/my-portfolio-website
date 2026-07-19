import { buildMetadata, localBusinessJsonLd } from './seo';

test('hreflang alternates for both locales', () => {
  const m = buildMetadata('sr', '/');
  expect(m.alternates?.languages).toHaveProperty('sr');
  expect(m.alternates?.languages).toHaveProperty('en');
});

test('localbusiness schema names Leskovac', () => {
  expect(JSON.stringify(localBusinessJsonLd())).toMatch(/Leskovac/);
});
