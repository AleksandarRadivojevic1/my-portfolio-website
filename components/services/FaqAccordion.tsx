'use client';

import { useState } from 'react';

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

// Disclosure list for the services FAQ. One row open at a time.
//
// This deliberately mirrors ProcessAccordion's motion language — the same
// grid-template-rows 0fr → 1fr reveal, the same 500ms cubic-bezier, the same
// amber accent and rotating "+" — so the two accordions on the page read as
// one component family rather than two unrelated widgets.
//
// It's a button + aria-expanded rather than <details>/<summary>: the native
// element still can't be height-animated consistently across browsers
// (::details-content is Chromium-first), and the answer copy is in the DOM
// either way, so nothing is lost to crawlers.
export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="flex flex-col divide-y divide-line border border-line">
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div key={item.id} data-open={isOpen} className="group relative">
            {/* Amber rail down the left edge of the open row. */}
            <span
              aria-hidden
              className="absolute inset-y-0 left-0 w-px origin-top scale-y-0 bg-accent transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-data-[open=true]:scale-y-100 motion-reduce:transition-none"
            />

            <h4>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${item.id}`}
                onClick={() => setOpenId(isOpen ? null : item.id)}
                className="flex w-full cursor-pointer items-start justify-between gap-6 p-6 text-left font-display text-base text-fg transition-colors duration-300 outline-none hover:bg-fg/[0.02] focus-visible:bg-fg/[0.02] motion-reduce:transition-none sm:text-lg"
              >
                {item.question}
                <span
                  aria-hidden
                  className="mt-1 shrink-0 text-lg leading-none text-muted transition-transform duration-300 ease-out group-data-[open=true]:rotate-45 group-data-[open=true]:text-accent motion-reduce:transition-none"
                >
                  +
                </span>
              </button>
            </h4>

            <div
              id={`faq-answer-${item.id}`}
              role="region"
              className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-data-[open=true]:grid-rows-[1fr] motion-reduce:transition-none"
            >
              <div className="overflow-hidden">
                {/* Fades and settles slightly behind the row opening, so the
                    answer arrives rather than snapping in with the height. */}
                <p className="translate-y-1 px-6 pb-6 text-sm text-muted opacity-0 transition-[opacity,transform] delay-100 duration-300 ease-out group-data-[open=true]:translate-y-0 group-data-[open=true]:opacity-100 motion-reduce:transition-none motion-reduce:delay-0 sm:text-base">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
