import { routing } from './routing';
test('locales and default', () => {
  expect(routing.locales).toEqual(['sr','en']);
  expect(routing.defaultLocale).toBe('sr');
});
