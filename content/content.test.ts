import { CAJS } from './work';
import { PACKAGES, MAINTENANCE } from './services';

test('no confidential figures in content', () => {
  const blob = JSON.stringify({ CAJS, PACKAGES, MAINTENANCE });
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
