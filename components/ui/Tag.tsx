import type { ReactNode } from 'react';

type TagProps = {
  children: ReactNode;
};

export function Tag({ children }: TagProps) {
  return (
    <span className="inline-flex items-center rounded-full border border-line px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-wide text-muted">
      {children}
    </span>
  );
}
