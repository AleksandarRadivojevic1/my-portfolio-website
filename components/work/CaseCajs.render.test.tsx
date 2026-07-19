import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { CaseCajs } from '@/components/work/CaseCajs';
import messages from '@/messages/sr.json';

// Same pattern as components/layout/LocaleToggle.test.tsx: next-intl's
// createNavigation-based Link resolves "next/navigation" in a way vitest's
// module graph can't follow under jsdom, so it's stubbed with a plain <a>.
vi.mock('@/i18n/navigation', () => ({
  Link: ({ href, children, ...rest }: { href: string; children: React.ReactNode }) => (
    <a href={typeof href === 'string' ? href : String(href)} {...rest}>
      {children}
    </a>
  ),
}));

beforeAll(() => {
  // Reveal() calls window.matchMedia via useSyncExternalStore; jsdom has no
  // implementation. Stub it (same pattern as components/ui/Reveal.test.tsx
  // and components/services/Services.render.test.tsx).
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

test('shows public market value, hides confidential Cajs prices', () => {
  render(
    <NextIntlClientProvider locale="sr" messages={messages}>
      <CaseCajs />
    </NextIntlClientProvider>,
  );

  expect(screen.getByText('€3.000–6.000')).toBeInTheDocument();
  expect(document.body.textContent).not.toContain('€500');
  expect(document.body.textContent).not.toContain('€40');
});
