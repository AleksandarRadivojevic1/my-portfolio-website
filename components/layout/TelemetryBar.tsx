'use client';

import { useEffect, useState } from 'react';
import { useMotionValueEvent, useScroll } from 'framer-motion';
import { SITE } from '@/content/site';

type TelemetryBarProps = {
  locale: string;
};

function formatTime(date: Date) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Belgrade',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date);
}

export function TelemetryBar({ locale }: TelemetryBarProps) {
  const { scrollYProgress } = useScroll();
  const [progress, setProgress] = useState(0);
  const [time, setTime] = useState<string | null>(null);

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    setProgress(Math.round(latest * 100));
  });

  useEffect(() => {
    // Client-only mount gate: the server (and the client's first paint) render
    // the `--:--:--` / `0%` placeholders. The first rAF callback below seeds the
    // real clock and scroll progress, so the wall clock never touches the
    // initial render path and server/client HTML stay identical.
    let frameId: number;
    let lastSecond = -1;
    let progressSeeded = false;

    const tick = () => {
      const now = new Date();
      // rAF fires ~60x/s but the clock only re-renders when the second rolls
      // over, so the ticking digit costs one state update per second.
      const second = now.getSeconds();
      if (second !== lastSecond) {
        lastSecond = second;
        setTime(formatTime(now));
      }
      if (!progressSeeded) {
        progressSeeded = true;
        setProgress(Math.round(scrollYProgress.get() * 100));
      }
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [scrollYProgress]);

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-bg/80 font-mono text-xs text-muted backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-2">
        <span>{SITE.location}</span>
        <span>
          {progress.toString().padStart(2, '0')}% ↕
        </span>
        {/* Tabular figures so the ticking seconds don't shift the row width. */}
        <span className="tabular-nums">
          {time ?? '--:--:--'} · {locale.toUpperCase()}
        </span>
      </div>
    </div>
  );
}
