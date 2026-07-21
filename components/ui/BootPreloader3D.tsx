'use client';

import { useEffect, useState, type ComponentType } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { BOOT_LINES, type BootState } from '@/components/webgl/bootLines';
import { BootScreen } from '@/components/ui/BootScreen';
import { setScrollLocked } from '@/lib/scrollLock';

type Phase = BootState['phase'];

/**
 * Is this device worth spending ~364 KB (1.16 MB parsed) of three.js on?
 *
 * Phones are the case this exists for: five fullscreen postprocessing passes on
 * a mid-range Android blocks the main thread for seconds, and mobile is where
 * most visitors arrive. They get <BootScreen /> instead — same sequence, drawn
 * in DOM. Called once on mount; SSR never reaches it.
 */
function canAfford3D(): boolean {
  if (window.innerWidth < 900) return false;
  const cores = navigator.hardwareConcurrency ?? 4;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
  return cores >= 4 && memory >= 4;
}

/**
 * Sequence lengths, per device class.
 *
 * The overlay is `fixed inset-0`, so no page content can paint until it lifts —
 * the sequence duration is a hard floor on Largest Contentful Paint. The full
 * version runs ~6.9s including the exit fade, which was most of why mobile LCP
 * measured 11.8s. Phones get ~2.3s: still a moment, but inside the budget.
 */
type Timing = {
  /** Corner counter 0 → 100. */
  count: number;
  /** Power-on band before the log starts. */
  power: number;
  /** Gap between boot log lines. */
  line: number;
  /** Pause on the completed log. */
  hold: number;
  /** "Dive into the screen" before the overlay lifts. */
  enter: number;
  /** Overlay fade-out, in seconds (framer-motion). */
  fade: number;
};

const TIMING: Record<'full' | 'fast', Timing> = {
  full: { count: 2200, power: 480, line: 230, hold: 900, enter: 1150, fade: 0.6 },
  fast: { count: 700, power: 180, line: 70, hold: 250, enter: 350, fade: 0.35 },
};

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
  const [Scene, setScene] = useState<ComponentType<{ boot: BootState }> | null>(null);
  // null until the capability check runs. Distinguishing "not decided yet" from
  // "decided against 3D" matters: on a capable device we render nothing while
  // the chunk downloads (as before), rather than flashing the DOM screen and
  // popping into the Apple II a few hundred ms later.
  const [use3D, setUse3D] = useState<boolean | null>(null);

  // Devices that can't afford the 3D scene are also the ones that can least
  // afford a 7-second overlay sitting on top of their LCP.
  const timing: Timing = use3D === false ? TIMING.fast : TIMING.full;

  useEffect(() => {
    if (reduced) setPhase('exit');
  }, [reduced]);

  // Fetch the 3D scene only if this device should render it. A bare `import()`
  // inside the effect (rather than next/dynamic at module scope) is what keeps
  // the chunk out of the initial graph entirely — phones and reduced-motion
  // users never request it.
  useEffect(() => {
    // set-state-in-effect is unavoidable here and not a cascading-render risk:
    // canAfford3D() reads window/navigator, which don't exist during SSR, so
    // the decision cannot be made until after mount. It runs exactly once.
    if (reduced) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUse3D(false);
      return;
    }
    const afford = canAfford3D();
    setUse3D(afford);
    if (!afford) return;

    let alive = true;
    import('@/components/webgl/BootScene').then((m) => {
      if (alive) setScene(() => m.BootScene);
    });
    return () => {
      alive = false;
    };
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

  // Each phase waits for the capability check (`use3D === null`) so the whole
  // sequence runs at one consistent speed. Starting on the full timing and
  // switching a tick later would restart the counter mid-count.
  useEffect(() => {
    if (phase !== 'boot' || use3D === null) return;
    let raf = 0;
    const start = performance.now();
    function tick(now: number) {
      const t = Math.min((now - start) / timing.count, 1);
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setCount(Math.round(eased * 100));
      if (t < 1) raf = requestAnimationFrame(tick);
      else setPhase('power');
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase, use3D, timing]);

  useEffect(() => {
    if (phase !== 'power') return;
    const id = window.setTimeout(() => setPhase('log'), timing.power);
    return () => window.clearTimeout(id);
  }, [phase, timing]);

  useEffect(() => {
    if (phase !== 'log') return;
    let line = 0;
    const id = window.setInterval(() => {
      line += 1;
      setVisibleLines(line);
      if (line >= BOOT_LINES.length) {
        window.clearInterval(id);
        window.setTimeout(() => setPhase('enter'), timing.hold);
      }
    }, timing.line);
    return () => window.clearInterval(id);
  }, [phase, timing]);

  // Enter: dive into the screen (glitch + push-in in the scene), then exit.
  useEffect(() => {
    if (phase !== 'enter') return;
    const id = window.setTimeout(() => setPhase('exit'), timing.enter);
    return () => window.clearTimeout(id);
  }, [phase, timing]);

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
          transition={{ duration: timing.fade, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* 3D once its chunk lands; the DOM screen on devices we decided
              against it for. While the check is pending or the chunk is in
              flight on a capable device, neither renders — the counter alone
              carries it, exactly as before. */}
          {!reduced && Scene && <Scene boot={boot} />}
          {!reduced && !Scene && use3D === false && <BootScreen boot={boot} />}

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
