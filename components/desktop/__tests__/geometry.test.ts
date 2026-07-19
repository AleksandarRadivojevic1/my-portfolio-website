import { clampToBounds } from '../geometry';

const size = { width: 100, height: 40 };
const bounds = { width: 1000, height: 600 };

test('position already inside is unchanged', () => {
  expect(clampToBounds({ x: 200, y: 100 }, size, bounds)).toEqual({ x: 200, y: 100 });
});

test('negative position clamps to 0', () => {
  expect(clampToBounds({ x: -50, y: -10 }, size, bounds)).toEqual({ x: 0, y: 0 });
});

test('overflowing position clamps to max (bounds - size)', () => {
  expect(clampToBounds({ x: 9999, y: 9999 }, size, bounds)).toEqual({ x: 900, y: 560 });
});

test('element larger than bounds pins to 0', () => {
  expect(clampToBounds({ x: 5, y: 5 }, { width: 2000, height: 800 }, bounds)).toEqual({ x: 0, y: 0 });
});
