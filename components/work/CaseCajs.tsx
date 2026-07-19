import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Reveal } from '@/components/ui/Reveal';
import { BracketButton } from '@/components/ui/BracketButton';
import { CaseHero } from '@/components/work/CaseHero';
import { FeatureList } from '@/components/work/FeatureList';
import { StatGrid } from '@/components/work/StatGrid';
import { OutcomeList } from '@/components/work/OutcomeList';
import { ScreenshotGrid } from '@/components/work/ScreenshotGrid';
import { TestimonialSlot } from '@/components/work/TestimonialSlot';

// The full Optika Cajs case-study body. Extracted from the route's page.tsx
// (which is async, per next-intl's setRequestLocale contract) so it stays a
// plain synchronous Server Component — directly renderable in tests, same
// pattern as components/sections/Work.tsx and Services.tsx.
export function CaseCajs() {
  const t = useTranslations('caseCajs');

  return (
    <section className="relative px-6 py-32">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-16">
        <div>
          <BracketButton as={Link} href="/#work">
            {t('hero.backLabel')}
          </BracketButton>
        </div>

        <Reveal>
          <CaseHero />
        </Reveal>

        <div className="flex flex-col gap-6">
          <h2 className="font-display text-2xl text-fg sm:text-3xl">{t('sections.challenge')}</h2>
          <p className="max-w-2xl text-base text-muted sm:text-lg">{t('challenge.body')}</p>
        </div>

        <div className="flex flex-col gap-6">
          <h2 className="font-display text-2xl text-fg sm:text-3xl">{t('sections.features')}</h2>
          <FeatureList />
        </div>

        <div className="flex flex-col gap-6">
          <h2 className="font-display text-2xl text-fg sm:text-3xl">{t('sections.stats')}</h2>
          <Reveal>
            <StatGrid />
          </Reveal>
        </div>

        <div className="flex flex-col gap-6">
          <h2 className="font-display text-2xl text-fg sm:text-3xl">{t('sections.outcomes')}</h2>
          <OutcomeList />
        </div>

        <div className="flex flex-col gap-6">
          <h2 className="font-display text-2xl text-fg sm:text-3xl">
            {t('sections.screenshots')}
          </h2>
          <Reveal>
            <ScreenshotGrid />
          </Reveal>
        </div>

        <div className="flex flex-col gap-6">
          <h2 className="font-display text-2xl text-fg sm:text-3xl">
            {t('sections.testimonial')}
          </h2>
          <Reveal>
            <TestimonialSlot />
          </Reveal>
        </div>

        <div>
          <BracketButton as={Link} href="/#work">
            {t('hero.backLabel')}
          </BracketButton>
        </div>
      </div>
    </section>
  );
}
