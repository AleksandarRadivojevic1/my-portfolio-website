import { CAJS, DESKTOP_PROJECTS, SKEDIO_CASE } from './work';
import { PACKAGES, MAINTENANCE } from './services';

test('no confidential figures in content', () => {
  const blob = JSON.stringify({ CAJS, PACKAGES, MAINTENANCE, DESKTOP_PROJECTS });
  expect(blob).not.toContain('€500'); // Cajs confidential one-time
  expect(blob).not.toContain('€40'); // founding maintenance (also covers €400)
});

test('public prices still present (guard is not over-broad)', () => {
  const blob = JSON.stringify({ PACKAGES, MAINTENANCE });
  expect(blob).toContain('€300–500'); // START range legitimately contains "500"
  expect(blob).toContain('€540'); // annual site maintenance legitimately contains "40"
});

test('cajs public market value present', () => {
  expect(CAJS.stats.marketValue).toBe('€3.000–6.000');
});

test('four packages with prices', () => {
  expect(PACKAGES.map((p) => p.id)).toEqual(['start', 'standard', 'plus', 'app']);
  expect(PACKAGES[3].priceLabel).toBe('od €3.000');
});

test('desktop projects: four folders in expected order', () => {
  expect(DESKTOP_PROJECTS.map((p) => p.id)).toEqual([
    'optika-cajs',
    'skedio',
    'soon-1',
    'soon-2',
  ]);
});

test('desktop projects: skedio exposes landing + app links', () => {
  const skedio = DESKTOP_PROJECTS.find((p) => p.id === 'skedio');
  expect(skedio?.links?.map((l) => l.href)).toEqual([
    'https://skedio.rs',
    'https://app.skedio.rs',
  ]);
});

test('desktop projects: no confidential figures', () => {
  const blob = JSON.stringify(DESKTOP_PROJECTS);
  expect(blob).not.toContain('€500');
  expect(blob).not.toContain('€40');
});

test('skedio case: slug and live urls', () => {
  expect(SKEDIO_CASE.slug).toBe('skedio');
  expect(SKEDIO_CASE.landing).toBe('https://skedio.rs');
  expect(SKEDIO_CASE.app).toBe('https://app.skedio.rs');
  expect(SKEDIO_CASE.features).toHaveLength(8);
  expect(SKEDIO_CASE.engineering).toHaveLength(6);
  expect(SKEDIO_CASE.screenshots).toHaveLength(4);
});

test('skedio case: no confidential figures', () => {
  const blob = JSON.stringify(SKEDIO_CASE);
  expect(blob).not.toContain('€500');
  expect(blob).not.toContain('€40');
});
