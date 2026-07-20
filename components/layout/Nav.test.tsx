import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { Nav } from './Nav';
import messages from '@/messages/en.json';

// next-intl navigation pulls in next/navigation (unresolvable under jsdom);
// stub Link as a plain <a> keeping the raw href, and usePathname for the
// LocaleToggle that Nav renders.
vi.mock('@/i18n/navigation', () => ({
  Link: ({ href, children, ...rest }: { href: string; children: React.ReactNode }) => (
    <a href={typeof href === 'string' ? href : String(href)} {...rest}>
      {children}
    </a>
  ),
  usePathname: () => '/',
}));

function renderNav() {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <Nav locale="en" />
    </NextIntlClientProvider>,
  );
}

test('section links are home-anchored (/#id) so they work from any route', () => {
  renderNav();
  expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/#about');
  expect(screen.getByRole('link', { name: 'Work' })).toHaveAttribute('href', '/#work');
  expect(screen.getByRole('link', { name: 'Services' })).toHaveAttribute('href', '/#services');
  expect(screen.getByRole('link', { name: 'Contact' })).toHaveAttribute('href', '/#contact');
});
