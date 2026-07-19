import { render, screen, fireEvent } from '@testing-library/react';
import { FolderIcon } from '../FolderIcon';

test('renders label and activates on click with its id', () => {
  const onActivate = vi.fn();
  render(<FolderIcon id="skedio" label="Skedio" onActivate={onActivate} />);
  const btn = screen.getByRole('button', { name: 'Skedio' });
  fireEvent.click(btn);
  expect(onActivate).toHaveBeenCalledWith('skedio');
});

test('locked folder exposes a locked accessible name', () => {
  render(<FolderIcon id="soon-1" label="Encrypted" locked onActivate={() => {}} />);
  expect(screen.getByRole('button', { name: /Encrypted.*locked/i })).toBeInTheDocument();
});
