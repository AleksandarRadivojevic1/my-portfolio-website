'use client';

import { useRef, useState } from 'react';

export type ProcessPanel = {
  id: string;
  /** Two-digit step number, e.g. "01". */
  n: string;
  title: string;
  body: string;
};

// Horizontal expanding-panel accordion (Spur-style), adapted to the warm CRT
// theme. Two behaviours, split cleanly by breakpoint so their utility classes
// never fight each other:
//
//   lg+   one panel is open at a time; hover or keyboard-focus swaps which one,
//         the open panel grows and the rest collapse to slivers.
//   < lg  a stacked tap-to-expand accordion; every panel starts collapsed to
//         its number + title, and tapping one opens its body (tapping again
//         closes it). Vertical space is tight on phones, so showing all five
//         bodies at once buries the section.
//
// Craft notes: on lg+ the inner content sits at a FIXED width so text never
// reflows as the panel animates — it's simply revealed by `overflow-hidden`.
// Below lg the body animates on grid-template-rows (0fr → 1fr), which gives a
// real height transition without hardcoding a pixel height.
export function ProcessAccordion({ steps }: { steps: ProcessPanel[] }) {
  // lg+ hover/focus target — null means at rest: all panels equal width, none
  // expanded. Below lg, which panel the user tapped open.
  const [active, setActive] = useState<number | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const listRef = useRef<HTMLOListElement>(null);

  // Leaving the list collapses everything back to rest instead of stranding
  // whichever panel the cursor happened to exit through. Skipped while a panel
  // holds keyboard focus, so tabbing out of the section doesn't yank the open
  // panel away from the focused one.
  const handleMouseLeave = () => {
    const list = listRef.current;
    if (list && list.contains(document.activeElement)) return;
    setActive(null);
  };

  return (
    <ol
      ref={listRef}
      onMouseLeave={handleMouseLeave}
      className="flex flex-col gap-3 lg:flex-row lg:gap-2"
    >
      {steps.map((step, i) => {
        const isActive = i === active;
        const isOpen = openId === step.id;
        return (
          <li
            key={step.id}
            data-active={isActive}
            data-open={isOpen}
            onMouseEnter={() => setActive(i)}
            className="group relative min-w-0 border border-line bg-fg/[0.015] transition-[flex-grow,background-color] duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] focus-within:border-accent/40 hover:bg-fg/[0.03] motion-reduce:transition-none lg:h-[24rem] lg:basis-0 lg:grow lg:overflow-hidden lg:data-[active=true]:grow-[3.4]"
          >
            {/* Amber rail: wipes in across the top of the open panel. */}
            <span
              aria-hidden
              className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-accent transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] max-lg:group-data-[open=true]:scale-x-100 motion-reduce:transition-none lg:group-data-[active=true]:scale-x-100"
            />

            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpenId(isOpen ? null : step.id)}
              onFocus={() => setActive(i)}
              className="flex h-full w-full flex-col justify-between gap-5 p-6 text-left outline-none lg:cursor-default lg:gap-8"
            >
              <span className="flex w-full items-baseline justify-between gap-2">
                <span className="font-mono text-xs tracking-[0.2em] text-accent">{step.n}</span>

                {/* Step counter on lg+, tap affordance below it. */}
                <span className="hidden font-mono text-[10px] uppercase tracking-[0.3em] text-muted opacity-0 transition-opacity duration-300 motion-reduce:transition-none lg:inline lg:group-data-[active=true]:opacity-100">
                  / {String(steps.length).padStart(2, '0')}
                </span>
                <span
                  aria-hidden
                  className="self-center text-lg leading-none text-muted transition-transform duration-300 ease-out group-data-[open=true]:rotate-45 group-data-[open=true]:text-accent motion-reduce:transition-none lg:hidden"
                >
                  +
                </span>
              </span>

              <span className="flex flex-col">
                {/* Below lg the body collapses via grid rows; on lg+ the wrapper
                    is inert and the paragraph fades with the panel. */}
                <span className="grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] max-lg:grid-rows-[0fr] max-lg:group-data-[open=true]:grid-rows-[1fr] motion-reduce:transition-none lg:block">
                  <span className="overflow-hidden">
                    {/* Fixed width on lg+ so the paragraph never reflows as the
                        panel animates — overflow-hidden reveals it instead. */}
                    <span className="block pb-4 text-sm leading-relaxed text-muted transition-[opacity,transform] delay-100 duration-300 ease-out motion-reduce:transition-none motion-reduce:delay-0 lg:w-[19rem] lg:max-w-full lg:translate-y-1 lg:opacity-0 lg:group-data-[active=true]:translate-y-0 lg:group-data-[active=true]:opacity-100">
                      {step.body}
                    </span>
                  </span>
                </span>
                {/* Full panel width so a collapsed panel wraps its title
                    cleanly rather than clipping it mid-word. */}
                <span className="font-display text-xl leading-tight text-fg sm:text-2xl">
                  {step.title}
                </span>
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
