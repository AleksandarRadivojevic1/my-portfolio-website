'use client';

import type { PointerEvent as ReactPointerEvent } from 'react';

export interface FolderIconProps {
  id: string;
  label: string;
  locked?: boolean;
  /** Absolute px position within the desktop. Omit both for in-flow (mobile grid). */
  x?: number;
  y?: number;
  dragging?: boolean;
  onActivate: (id: string) => void;
  onPointerDown?: (e: ReactPointerEvent, id: string) => void;
}

function FolderGlyph({ locked }: { locked?: boolean }) {
  return (
    <svg width="48" height="40" viewBox="0 0 48 40" fill="none" aria-hidden="true">
      <path
        d="M2 8a4 4 0 0 1 4-4h12l5 5h19a4 4 0 0 1 4 4v21a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8Z"
        fill="currentColor"
        opacity={locked ? 0.5 : 0.92}
      />
      {locked && (
        <path
          d="M20 22v-2a4 4 0 0 1 8 0v2m-10 0h12v8H18v-8Z"
          stroke="#0A0805"
          strokeWidth="1.5"
          fill="none"
        />
      )}
    </svg>
  );
}

export function FolderIcon({
  id,
  label,
  locked,
  x,
  y,
  dragging,
  onActivate,
  onPointerDown,
}: FolderIconProps) {
  const positioned = typeof x === 'number' && typeof y === 'number';
  return (
    <button
      type="button"
      data-folder={id}
      aria-label={locked ? `${label} (locked)` : label}
      onPointerDown={(e) => onPointerDown?.(e, id)}
      onClick={() => onActivate(id)}
      style={positioned ? { left: x, top: y } : undefined}
      className={[
        'flex w-28 flex-col items-center gap-2 rounded-sm p-2 text-center text-fg transition-opacity',
        'hover:text-accent focus-visible:outline focus-visible:outline-1 focus-visible:outline-accent',
        positioned ? 'absolute touch-none select-none' : 'relative',
        dragging ? 'cursor-grabbing' : positioned ? 'cursor-grab' : 'cursor-pointer',
        locked ? 'opacity-45 hover:opacity-70' : 'opacity-100',
      ].join(' ')}
    >
      <FolderGlyph locked={locked} />
      <span className="font-mono text-xs leading-tight tracking-wide">{label}</span>
    </button>
  );
}
