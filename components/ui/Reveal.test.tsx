import { render, screen } from '@testing-library/react';
import { Reveal } from './Reveal';

beforeAll(() => {
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

test('renders children (reduced motion)', () => {
  render(<Reveal><span>hi</span></Reveal>);
  expect(screen.getByText('hi')).toBeInTheDocument();
});
