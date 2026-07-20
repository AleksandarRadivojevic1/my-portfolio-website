import { useTranslations } from 'next-intl';
import { CAJS } from '@/content/work';

export function TestimonialSlot() {
  const t = useTranslations('work.testimonial');
  const { testimonial } = CAJS;

  return (
    <div className="flex h-full flex-col gap-4 border border-dashed border-line p-6">
      <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
        {t('kicker')}
      </span>
      {testimonial ? (
        <blockquote className="flex flex-1 flex-col justify-between gap-4">
          <p className="font-display text-lg text-fg sm:text-xl">&ldquo;{testimonial.quote}&rdquo;</p>
          <footer className="font-mono text-xs text-muted">
            {testimonial.author}
            {testimonial.role ? `, ${testimonial.role}` : null}
          </footer>
        </blockquote>
      ) : (
        <p className="text-sm italic text-muted sm:text-base">{t('comingSoon')}</p>
      )}
    </div>
  );
}
