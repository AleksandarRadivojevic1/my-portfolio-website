'use client';

import { useEffect, useState } from 'react';

export interface MenuBarProps {
  brand: string;
}

export function MenuBar({ brand }: MenuBarProps) {
  const [time, setTime] = useState('--:--:--');

  useEffect(() => {
    const tick = () => setTime(new Date().toTimeString().slice(0, 8));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="pointer-events-none flex items-center justify-between border-b border-line px-4 py-2 font-mono text-xs tracking-wide text-muted">
      <span>{brand}</span>
      <span>{time}</span>
    </div>
  );
}
