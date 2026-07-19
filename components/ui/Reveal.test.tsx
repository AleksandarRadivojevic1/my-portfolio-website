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

test('reduced motion: no hidden/animated inline style survives mount (no permanent opacity:0)', () => {
  render(<Reveal><span>hi</span></Reveal>);
  const wrapper = screen.getByText('hi').parentElement;
  // Once mounted, reduced motion must render the plain element with no
  // motion-driven inline style (e.g. no leftover `opacity: 0` from the
  // SSR-safe initial render before the post-mount correction).
  expect(wrapper?.getAttribute('style')).toBeNull();
});

test('animated branch: renders a [data-reveal] marker so no-JS CSS can neutralize the baked-in hidden style', () => {
  window.matchMedia = ((q: string) => ({
    matches: false,
    media: q,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
    onchange: null,
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;

  render(<Reveal><span>hi</span></Reveal>);
  const wrapper = screen.getByText('hi').parentElement;
  expect(wrapper?.hasAttribute('data-reveal')).toBe(true);
});
