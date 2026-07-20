import { render, screen, fireEvent, within } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { Desktop } from '../Desktop';
import messages from '@/messages/en.json';

function setMatchMedia(matches: boolean) {
  window.matchMedia = ((q: string) => ({
    matches,
    media: q,
    onchange: null,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}

function renderDesktop() {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <Desktop />
    </NextIntlClientProvider>,
  );
}

beforeEach(() => setMatchMedia(false)); // desktop mode by default

test('renders a folder button for every desktop project', () => {
  renderDesktop();
  expect(screen.getByRole('button', { name: 'Optika Cajs' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Skedio' })).toBeInTheDocument();
  expect(screen.getAllByRole('button', { name: /Encrypted/i })).toHaveLength(2);
});

test('activating a real folder opens its window with content and links', () => {
  renderDesktop();
  fireEvent.click(screen.getByRole('button', { name: 'Skedio' }));
  const dialog = screen.getByRole('dialog', { name: 'Skedio' });
  expect(within(dialog).getByRole('link', { name: /Landing/ })).toHaveAttribute('href', 'https://skedio.rs');
  expect(within(dialog).getByRole('link', { name: /Open app/ })).toHaveAttribute('href', 'https://app.skedio.rs');
});

test('activating a locked folder opens the in-development window', () => {
  renderDesktop();
  fireEvent.click(screen.getAllByRole('button', { name: /Encrypted/i })[0]);
  expect(screen.getByText('// in development')).toBeInTheDocument();
});

test('Escape closes an open window', () => {
  renderDesktop();
  fireEvent.click(screen.getByRole('button', { name: 'Skedio' }));
  fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});

test('confidential figures never render in an opened case window', () => {
  renderDesktop();
  fireEvent.click(screen.getByRole('button', { name: 'Optika Cajs' }));
  expect(document.body.textContent).not.toContain('€500');
  expect(document.body.textContent).not.toContain('€40');
  expect(screen.getByText('€3.000–6.000')).toBeInTheDocument();
});

test('mobile mode renders folders in flow (no absolute positioning)', () => {
  setMatchMedia(true);
  renderDesktop();
  const folder = screen.getByRole('button', { name: 'Skedio' });
  expect(folder.className).not.toContain('absolute');
});

test('Skedio window links to its full case study', () => {
  renderDesktop();
  fireEvent.click(screen.getByRole('button', { name: 'Skedio' }));
  const dialog = screen.getByRole('dialog', { name: 'Skedio' });
  expect(within(dialog).getByRole('link', { name: /case study/i })).toHaveAttribute('href', '/work/skedio');
});
