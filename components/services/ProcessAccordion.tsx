'use client';

import { useState } from 'react';

export type ProcessPanel = {
  id: string;
  /** Two-digit step number, e.g. "01". */
  n: string;
  title: string;
  body: string;
};

// Horizontal expanding-panel accordion (Spur-style), adapted to the warm CRT
// theme. One panel is open at a time: on lg+ the open panel grows and the rest
// collapse to slivers; hover or keyboard-focus swaps which is open. Below lg it
// degrades to a plain stacked list with every panel fully shown.
//
// Craft notes: the inner content sits at a FIXED width so text never reflows as
// the panel animates — it's simply revealed by the panel's `overflow-hidden`.
// All copy is always in the DOM (only visually hidden via opacity), so screen
// readers get the full content regardless of which panel is visually open.
export function ProcessAccordion({ steps }: { steps: ProcessPanel[] }) {
  const [active, setActive] = useState(0);

  return (
    <ol className="flex flex-col gap-3 lg:flex-row lg:gap-2">
      {steps.map((step, i) => {
        const isActive = i === active;
        return (
          <li
            key={step.id}
            data-active={isActive}
            tabIndex={0}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            className="group relative min-w-0 border border-line bg-fg/[0.015] outline-none transition-[flex-grow,background-color] duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-fg/[0.03] focus-visible:border-accent/40 motion-reduce:transition-none lg:h-[24rem] lg:basis-0 lg:grow lg:overflow-hidden lg:data-[active=true]:grow-[3.4]"
          >
            {/* Amber rail: wipes in across the top of the open panel. */}
            <span
              aria-hidden
              className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-accent transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-data-[active=true]:scale-x-100 motion-reduce:transition-none"
            />

            <div className="flex h-full w-full flex-col justify-between gap-8 p-6">
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-mono text-xs tracking-[0.2em] text-accent">{step.n}</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted opacity-0 transition-opacity duration-300 group-data-[active=true]:opacity-100 motion-reduce:transition-none">
                  / {String(steps.length).padStart(2, '0')}
                </span>
              </div>

              <div className="flex flex-col gap-4">
                {/* Fixed width so the paragraph never reflows as the panel
                    animates — the panel's overflow-hidden reveals it instead. */}
                <p className="w-[19rem] max-w-full text-sm leading-relaxed text-muted transition-[opacity,transform] delay-100 duration-300 ease-out motion-reduce:transition-none motion-reduce:delay-0 lg:translate-y-1 lg:opacity-0 lg:group-data-[active=true]:translate-y-0 lg:group-data-[active=true]:opacity-100">
                  {step.body}
                </p>
                {/* Full panel width so a collapsed panel wraps its title
                    cleanly rather than clipping it mid-word. */}
                <h4 className="font-display text-xl leading-tight text-fg sm:text-2xl">
                  {step.title}
                </h4>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
