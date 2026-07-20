import { render, screen, fireEvent } from '@testing-library/react';
import { ProjectWindow, type WindowContent } from '../ProjectWindow';

// next-intl's <Link> pulls in next/navigation, which vitest can't resolve under
// jsdom; stub it with a plain <a> carrying a marker (same pattern as
// CaseSkedio.render.test.tsx). The marker lets us assert the case-study route
// goes through the client-side Link while external links stay plain <a>.
vi.mock('@/i18n/navigation', () => ({
  Link: ({ href, children, ...rest }: { href: string; children: React.ReactNode }) => (
    <a data-intl-link="" href={typeof href === 'string' ? href : String(href)} {...rest}>
      {children}
    </a>
  ),
}));

const base = { mode: 'window' as const, x: 40, y: 40, z: 10, onClose: () => {}, onFocus: () => {} };

function renderWindow(content: WindowContent, overrides: Partial<typeof base> = {}) {
  return render(<ProjectWindow {...base} {...overrides} content={content} />);
}

const optika: WindowContent = {
  id: 'optika-cajs',
  title: 'Optika Cajs',
  summary: 'A complete online system.',
  builtTitle: 'What was built',
  built: [{ title: 'Online store' }, { title: 'Prescription-lens configurator' }],
  specsTitle: 'Specs',
  stackTitle: 'Stack',
  stats: [{ label: 'Market value', value: '€3.000–6.000' }],
  stack: ['PostgreSQL', 'Docker'],
  links: [{ label: 'Live site', href: 'https://optikacajs.rs', external: true }],
  caseHref: '/work/optika-cajs',
  caseCta: 'Open full case study →',
};

test('renders title, built items, specs and a live link', () => {
  renderWindow(optika);
  expect(screen.getByRole('dialog', { name: 'Optika Cajs' })).toBeInTheDocument();
  expect(screen.getByText('Online store')).toBeInTheDocument();
  expect(screen.getByText('€3.000–6.000')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Live site' })).toHaveAttribute('href', 'https://optikacajs.rs');
});

test('case-study link routes through the client-side Link; externals stay plain <a>', () => {
  renderWindow(optika);
  const caseLink = screen.getByRole('link', { name: /case study/i });
  expect(caseLink).toHaveAttribute('data-intl-link');
  expect(caseLink).toHaveAttribute('href', '/work/optika-cajs');
  // External live-site link must remain a plain, full-navigation anchor.
  expect(screen.getByRole('link', { name: 'Live site' })).not.toHaveAttribute('data-intl-link');
});

test('window content never leaks confidential figures', () => {
  renderWindow(optika);
  expect(document.body.textContent).not.toContain('€500');
  expect(document.body.textContent).not.toContain('€40');
});

test('Escape triggers onClose with the window id', () => {
  const onClose = vi.fn();
  renderWindow(optika, { onClose });
  fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
  expect(onClose).toHaveBeenCalledWith('optika-cajs');
});

test('locked window shows the in-development body and no links', () => {
  const locked: WindowContent = {
    id: 'soon-1',
    title: 'Encrypted',
    summary: '',
    locked: true,
    lockedBody: '// in development',
  };
  renderWindow(locked);
  expect(screen.getByText('// in development')).toBeInTheDocument();
  expect(screen.queryByRole('link')).not.toBeInTheDocument();
});
