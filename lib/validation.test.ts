import { validateContact } from './validation';

test('rejects empty', () => {
  expect(validateContact({ name: '', email: '', message: '' }).ok).toBe(false);
});

test('rejects bad email', () => {
  expect(validateContact({ name: 'A', email: 'x', message: 'hello there' }).ok).toBe(false);
});

test('accepts valid', () => {
  expect(
    validateContact({ name: 'Alex', email: 'a@b.com', message: 'zdravo, treba mi sajt' }).ok,
  ).toBe(true);
});
