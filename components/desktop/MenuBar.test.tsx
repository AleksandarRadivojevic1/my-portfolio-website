import { render, screen } from '@testing-library/react';
import { MenuBar } from './MenuBar';

test('renders the brand label', () => {
  render(<MenuBar brand="ALEXRAD // OS" />);
  expect(screen.getByText('ALEXRAD // OS')).toBeInTheDocument();
});

test('renders a clock placeholder that matches HH:MM:SS shape', () => {
  render(<MenuBar brand="ALEXRAD // OS" />);
  expect(screen.getByText(/^(\d{2}|-{2}):(\d{2}|-{2}):(\d{2}|-{2})$/)).toBeInTheDocument();
});
