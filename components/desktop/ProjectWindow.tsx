'use client';

import { useEffect, useId, useRef } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from 'react';

export interface WindowLink {
  label: string;
  href: string;
  external?: boolean;
}
export interface WindowStat {
  label: string;
  value: string;
}
export interface WindowBuilt {
  title: string;
}
export interface WindowContent {
  id: string;
  title: string;
  summary: string;
  locked?: boolean;
  lockedBody?: string;
  builtTitle?: string;
  built?: WindowBuilt[];
  specsTitle?: string;
  stackTitle?: string;
  stats?: WindowStat[];
  stack?: string[];
  links?: WindowLink[];
  caseHref?: string;
  caseCta?: string;
}

export interface ProjectWindowProps {
  content: WindowContent;
  mode: 'window' | 'sheet';
  x: number;
  y: number;
  z: number;
  onClose: (id: string) => void;
  onFocus: (id: string) => void;
  onTitlePointerDown?: (e: ReactPointerEvent, id: string) => void;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function ProjectWindow({
  content,
  mode,
  x,
  y,
  z,
  onClose,
  onFocus,
  onTitlePointerDown,
}: ProjectWindowProps) {
  const ref = useRef<HTMLDivElement>(null);
  const titleId = useId();

  // Focus the window on mount so keyboard/AT users land inside it.
  useEffect(() => {
    ref.current?.focus();
  }, []);

  function handleKeyDown(e: ReactKeyboardEvent<HTMLDivElement>) {
    if (e.key === 'Escape') {
      e.stopPropagation();
      onClose(content.id);
      return;
    }
    if (e.key !== 'Tab' || !ref.current) return;
    // Minimal focus trap: keep Tab focus cycling within the window.
    const nodes = Array.from(ref.current.querySelectorAll<HTMLElement>(FOCUSABLE));
    if (nodes.length === 0) {
      e.preventDefault();
      ref.current.focus();
      return;
    }
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    const active = document.activeElement;
    if (e.shiftKey && (active === first || active === ref.current)) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  }

  const isSheet = mode === 'sheet';

  return (
    <div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      tabIndex={-1}
      onKeyDown={handleKeyDown}
      onPointerDown={() => onFocus(content.id)}
      style={isSheet ? undefined : { left: x, top: y, zIndex: z }}
      className={[
        'flex flex-col border border-line bg-bg/95 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.8)] backdrop-blur-sm outline-none',
        isSheet
          ? 'fixed inset-0 z-50'
          : 'absolute max-h-[80vh] w-[min(92vw,32rem)]',
      ].join(' ')}
    >
      {/* Title bar */}
      <div
        onPointerDown={(e) => !isSheet && onTitlePointerDown?.(e, content.id)}
        className={[
          'flex items-center justify-between border-b border-line px-3 py-2 font-mono text-xs text-muted',
          isSheet ? '' : 'cursor-grab touch-none select-none',
        ].join(' ')}
      >
        <span>[ {content.id} ]</span>
        <button
          type="button"
          onClick={() => onClose(content.id)}
          aria-label="Close"
          className="px-2 text-muted hover:text-accent focus-visible:outline focus-visible:outline-1 focus-visible:outline-accent"
        >
          [×]
        </button>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-6 overflow-y-auto p-6">
        <div className="flex flex-col gap-3">
          <h3 id={titleId} className="font-display text-2xl text-fg">{content.title}</h3>
          {content.locked ? (
            <p className="font-mono text-sm text-muted">{content.lockedBody}</p>
          ) : (
            content.summary && <p className="text-sm text-muted sm:text-base">{content.summary}</p>
          )}
        </div>

        {content.built && content.built.length > 0 && (
          <section className="flex flex-col gap-3">
            <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
              {content.builtTitle}
            </h4>
            <ul className="grid gap-2 sm:grid-cols-2">
              {content.built.map((b) => (
                <li key={b.title} className="border border-line px-3 py-2 text-sm text-fg">
                  {b.title}
                </li>
              ))}
            </ul>
          </section>
        )}

        {content.stats && content.stats.length > 0 && (
          <section className="flex flex-col gap-3">
            <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
              {content.specsTitle}
            </h4>
            <dl className="grid grid-cols-2 gap-3">
              {content.stats.map((s) => (
                <div key={s.label} className="flex flex-col gap-1">
                  <dt className="font-mono text-[0.7rem] uppercase tracking-wide text-muted">
                    {s.label}
                  </dt>
                  <dd className="text-sm text-fg">{s.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {content.stack && content.stack.length > 0 && (
          <section className="flex flex-col gap-3">
            <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
              {content.stackTitle}
            </h4>
            <div className="flex flex-wrap gap-2">
              {content.stack.map((tech) => (
                <span key={tech} className="border border-line px-2 py-1 font-mono text-xs text-muted">
                  {tech}
                </span>
              ))}
            </div>
          </section>
        )}

        {((content.links && content.links.length > 0) || content.caseHref) && (
          <section className="flex flex-wrap gap-3 pt-2">
            {content.links?.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target={l.external ? '_blank' : undefined}
                rel={l.external ? 'noopener noreferrer' : undefined}
                className="border border-line px-4 py-2 font-mono text-xs text-fg hover:border-accent hover:text-accent focus-visible:outline focus-visible:outline-1 focus-visible:outline-accent"
              >
                {l.label} <span aria-hidden="true">↗</span>
              </a>
            ))}
            {content.caseHref && (
              <a
                href={content.caseHref}
                className="border border-accent px-4 py-2 font-mono text-xs text-accent hover:bg-accent hover:text-bg focus-visible:outline focus-visible:outline-1 focus-visible:outline-accent"
              >
                {content.caseCta}
              </a>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
