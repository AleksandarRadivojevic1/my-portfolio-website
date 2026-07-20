import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { CaseSkedio } from '@/components/work/CaseSkedio';
import messages from '@/messages/sr.json';

// next-intl Link resolves next/navigation in a way vitest can't follow under
// jsdom; stub with a plain <a> (same pattern as CaseCajs.render.test.tsx).
vi.mock('@/i18n/navigation', () => ({
  Link: ({ href, children, ...rest }: { href: string; children: React.ReactNode }) => (
    <a href={typeof href === 'string' ? href : String(href)} {...rest}>
      {children}
    </a>
  ),
}));

// next/image optimization is unnecessary noise in jsdom; render a plain <img>
// and drop non-DOM props (fill/sizes) to keep the output pristine.
vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));

beforeAll(() => {
  // Reveal reads window.matchMedia via useSyncExternalStore.
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

test('renders the Skedio case study: title, feature, engineering, stat, links, screenshot', () => {
  render(
    <NextIntlClientProvider locale="sr" messages={messages}>
      <CaseSkedio />
    </NextIntlClientProvider>,
  );

  expect(screen.getByRole('heading', { level: 1, name: 'Skedio' })).toBeInTheDocument();
  expect(screen.getByText(messages.caseSkedio.features.booking.title)).toBeInTheDocument();
  expect(screen.getByText(messages.caseSkedio.engineering.timezone.title)).toBeInTheDocument();
  expect(screen.getByText('~11.000')).toBeInTheDocument();
  expect(screen.getByAltText(messages.caseSkedio.shots.dashboard)).toBeInTheDocument();

  const links = screen.getAllByRole('link');
  expect(links.some((a) => a.getAttribute('href') === 'https://skedio.rs')).toBe(true);
  expect(links.some((a) => a.getAttribute('href') === 'https://app.skedio.rs')).toBe(true);
});
