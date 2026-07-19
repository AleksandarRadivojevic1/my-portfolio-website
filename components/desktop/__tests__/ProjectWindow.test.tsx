import { render, screen, fireEvent } from '@testing-library/react';
import { ProjectWindow, type WindowContent } from '../ProjectWindow';

const base = { mode: 'window' as const, x: 40, y: 40, z: 10, onClose: () => {}, onFocus: () => {} };

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
  render(<ProjectWindow {...base} content={optika} />);
  expect(screen.getByRole('dialog', { name: 'Optika Cajs' })).toBeInTheDocument();
  expect(screen.getByText('Online store')).toBeInTheDocument();
  expect(screen.getByText('€3.000–6.000')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Live site' })).toHaveAttribute('href', 'https://optikacajs.rs');
});

test('window content never leaks confidential figures', () => {
  render(<ProjectWindow {...base} content={optika} />);
  expect(document.body.textContent).not.toContain('€500');
  expect(document.body.textContent).not.toContain('€40');
});

test('Escape triggers onClose with the window id', () => {
  const onClose = vi.fn();
  render(<ProjectWindow {...base} onClose={onClose} content={optika} />);
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
  render(<ProjectWindow {...base} content={locked} />);
  expect(screen.getByText('// in development')).toBeInTheDocument();
  expect(screen.queryByRole('link')).not.toBeInTheDocument();
});
