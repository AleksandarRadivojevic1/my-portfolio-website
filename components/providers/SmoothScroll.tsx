'use client';

import Lenis from 'lenis';
import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { registerScrollController } from '@/lib/scrollLock';

type SmoothScrollProps = {
  children: ReactNode;
};

export function SmoothScroll({ children }: SmoothScrollProps) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const lenis = new Lenis();
    // Adopt the current scroll-lock state (the boot preloader may already have
    // locked scrolling before this mounted).
    const unregister = registerScrollController(lenis);

    let frameId: number;
    function raf(time: number) {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    }
    frameId = requestAnimationFrame(raf);

    return () => {
      unregister();
      cancelAnimationFrame(frameId);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
