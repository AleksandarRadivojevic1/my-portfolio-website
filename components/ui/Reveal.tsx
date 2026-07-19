'use client';

import { motion } from 'framer-motion';
import { useSyncExternalStore } from 'react';
import type { ElementType, ReactNode } from 'react';

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
};

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

function subscribe(onStoreChange: () => void) {
  const mql = window.matchMedia(REDUCED_MOTION_QUERY);
  mql.addEventListener('change', onStoreChange);
  return () => mql.removeEventListener('change', onStoreChange);
}

function getSnapshot() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

// SSR can't know the browser's media-query preference, so it always renders
// the animated (non-reduced) variant. `useSyncExternalStore` is used
// (instead of `useState`/`useEffect`) specifically because it guarantees a
// real corrective re-render right after hydration when the client snapshot
// differs from `getServerSnapshot`. A plain `useState`-derived flag does
// *not* give that guarantee: React treats an attribute-only mismatch between
// the server output and the first client render as something it will "not
// patch up" (see https://react.dev/link/hydration-mismatch), so a visitor
// who already has reduced-motion enabled at page load would otherwise hydrate
// into a `motion.*` element permanently stuck at its `initial={{ opacity: 0 }}`
// state — invisible forever, since nothing else re-renders that node.
function getServerSnapshot() {
  return false;
}

function useReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function Reveal({ children, as = 'div', delay = 0 }: RevealProps) {
  const shouldReduceMotion = useReducedMotion();
  const Comp = as;

  if (shouldReduceMotion) {
    return <Comp>{children}</Comp>;
  }

  const MotionComp = motion[Comp as keyof typeof motion] as typeof motion.div;

  return (
    <MotionComp
      data-reveal
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </MotionComp>
  );
}
