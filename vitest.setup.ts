import '@testing-library/jest-dom';

// jsdom has no IntersectionObserver. framer-motion's `whileInView` (used by
// components/ui/Reveal) requires one to mount at all, even transiently
// before a component decides not to use it (e.g. reduced-motion's post-mount
// correction in Reveal). A minimal no-op stub is enough for unit tests,
// which don't assert on actual viewport-intersection behavior.
class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin: string = '';
  readonly thresholds: ReadonlyArray<number> = [];
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).IntersectionObserver = MockIntersectionObserver;
