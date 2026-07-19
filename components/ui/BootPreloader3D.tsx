'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { BOOT_LINES, type BootState } from '@/components/webgl/BootScene';
import { setScrollLocked } from '@/lib/scrollLock';

const BootScene = dynamic(
  () => import('@/components/webgl/BootScene').then((m) => m.BootScene),
  { ssr: false }
);

type Phase = BootState['phase'];

const COUNT_MS = 2200;
const LINE_MS = 230;
const HOLD_MS = 900;
const ENTER_MS = 1150;

type BootPreloader3DProps = { onDone?: () => void };

/**
 * 3D boot entrance: an Apple II sits in the dark, a counter fills in the
 * corner, the CRT powers on, and the amber boot log types out *on the actual
 * screen* (a live canvas texture on the screen mesh) before clearing into the
 * site. CRT post-fx: bloom, chromatic aberration, grain, vignette.
 */
export function BootPreloader3D({ onDone }: BootPreloader3DProps) {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<Phase>('boot');
  const [count, setCount] = useState(0);
  const [visibleLines, setVisibleLines] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (reduced) setPhase('exit');
  }, [reduced]);

  // Lock scrolling while the boot overlay is up. The overlay is `fixed`, so
  // without this the document (and Lenis) scrolls underneath it and the visitor
  // lands mid-page when it lifts. This freezes both native scroll and Lenis
  // (see lib/scrollLock). Released exactly when the exit animation completes.
  useEffect(() => {
    setScrollLocked(!done);
  }, [done]);

  // Safety: never leave the page frozen if this unmounts mid-boot.
  useEffect(() => () => setScrollLocked(false), []);

  useEffect(() => {
    if (phase !== 'boot') return;
    let raf = 0;
    const start = performance.now();
    function tick(now: number) {
      const t = Math.min((now - start) / COUNT_MS, 1);
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setCount(Math.round(eased * 100));
      if (t < 1) raf = requestAnimationFrame(tick);
      else setPhase('power');
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'power') return;
    const id = window.setTimeout(() => setPhase('log'), 480);
    return () => window.clearTimeout(id);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'log') return;
    let line = 0;
    const id = window.setInterval(() => {
      line += 1;
      setVisibleLines(line);
      if (line >= BOOT_LINES.length) {
        window.clearInterval(id);
        window.setTimeout(() => setPhase('enter'), HOLD_MS);
      }
    }, LINE_MS);
    return () => window.clearInterval(id);
  }, [phase]);

  // Enter: dive into the screen (glitch + push-in in the scene), then exit.
  useEffect(() => {
    if (phase !== 'enter') return;
    const id = window.setTimeout(() => setPhase('exit'), ENTER_MS);
    return () => window.clearTimeout(id);
  }, [phase]);

  const boot: BootState = { phase, count, visibleLines };

  return (
    <AnimatePresence
      onExitComplete={() => {
        setDone(true);
        onDone?.();
      }}
    >
      {phase !== 'exit' && (
        <motion.div
          key="boot3d"
          className="fixed inset-0 z-[100] bg-bg"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
        >
          {!reduced && <BootScene boot={boot} />}

          {/* Corner counter during the count. */}
          <AnimatePresence>
            {phase === 'boot' && (
              <motion.div
                key="counter"
                className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between px-6 pb-8 sm:px-10 sm:pb-10"
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber/70 sm:text-xs">
                  Booting AR/OS
                </span>
                <span className="font-mono text-4xl tabular-nums text-amber sm:text-6xl">
                  {String(count).padStart(3, '0')}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
