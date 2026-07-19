import { useTranslations } from 'next-intl';

// Real captures pending from Alex — see /public/work/cajs/*.webp in the task
// brief. Deliberately not wired to next/image (or a plain <img>) yet: a
// static-imported next/image would break the build against a missing file,
// and a plain <img src> would 404 on every render. This dashed placeholder
// mirrors TestimonialSlot's "coming soon" treatment and keeps three slots
// ready to swap for real <Image> captures once they exist.
const SLOT_COUNT = 3;

export function ScreenshotGrid() {
  const t = useTranslations('caseCajs.screenshots');

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {Array.from({ length: SLOT_COUNT }, (_, i) => (
        <div
          key={i}
          className="flex aspect-video flex-col items-center justify-center gap-2 border border-dashed border-line p-6 text-center"
        >
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
            {t('placeholder')}
          </span>
        </div>
      ))}
    </div>
  );
}
