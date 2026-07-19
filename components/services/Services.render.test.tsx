import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { Services } from '@/components/sections/Services';
import messages from '@/messages/sr.json';

beforeAll(() => {
  // Reveal() calls window.matchMedia via useSyncExternalStore; jsdom has no
  // implementation. Stub it (same pattern as components/ui/Reveal.test.tsx).
  window.matchMedia = ((q: string) => ({
    matches: true,
    media: q,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
    onchange: null,
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
});

test('shows package ranges, hides confidential', () => {
  render(
    <NextIntlClientProvider locale="sr" messages={messages}>
      <Services />
    </NextIntlClientProvider>,
  );

  expect(screen.getByText('€300–500')).toBeInTheDocument();
  expect(document.body.textContent).not.toContain('€500');
});
