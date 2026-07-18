import type { ReactNode } from 'react';

type MonoLabelProps = {
  children: ReactNode;
};

export function MonoLabel({ children }: MonoLabelProps) {
  return (
    <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
      {children}
    </span>
  );
}
