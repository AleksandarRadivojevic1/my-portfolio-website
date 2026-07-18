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
    hour12: false,
  }).format(date);
}

export function TelemetryBar({ locale }: TelemetryBarProps) {
  const { scrollYProgress } = useScroll();
  const [progress, setProgress] = useState(0);
  const [time, setTime] = useState(() => formatTime(new Date()));

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    setProgress(Math.round(latest * 100));
  });

  useEffect(() => {
    let frameId: number;
    let lastMinute = -1;

    const tick = () => {
      const now = new Date();
      const minute = now.getMinutes();
      if (minute !== lastMinute) {
        lastMinute = minute;
        setTime(formatTime(now));
      }
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-bg/80 font-mono text-xs text-muted backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-2">
        <span>{SITE.location}</span>
        <span>
          {progress.toString().padStart(2, '0')}% ↕
        </span>
        <span>
          {time} · {locale.toUpperCase()}
        </span>
      </div>
    </div>
  );
}
