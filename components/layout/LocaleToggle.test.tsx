import { render, screen } from '@testing-library/react';
import { LocaleToggle } from './LocaleToggle';

vi.mock('@/i18n/navigation', () => ({
  Link: ({ href, children, ...rest }: { href: string; children: React.ReactNode }) => (
    <a href={typeof href === 'string' ? href : String(href)} {...rest}>
      {children}
    </a>
  ),
  usePathname: () => '/',
}));

test('shows both locales', () => {
  render(<LocaleToggle current="sr" />);
  expect(screen.getByText('SR')).toBeInTheDocument();
  expect(screen.getByText('EN')).toBeInTheDocument();
});
