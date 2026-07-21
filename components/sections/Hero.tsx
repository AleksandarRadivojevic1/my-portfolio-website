import { useTranslations } from 'next-intl';
import { SectionCounter } from '@/components/ui/SectionCounter';
import { MonoLabel } from '@/components/ui/MonoLabel';
import { Reveal } from '@/components/ui/Reveal';
import { BracketButton } from '@/components/ui/BracketButton';

const NAME_SIZE = 'text-[clamp(3rem,12vw,11rem)]';

export function Hero() {
  const t = useTranslations('hero');

  return (
    <section
      id="hero"
      // `100svh`, not `min-h-screen` (100vh): on iOS `100vh` is the *large*
      // viewport (behind Safari's UI), so `justify-center` centred the content
      // in an oversized box and pushed the first name line up under the fixed
      // nav. `svh` is the stable small viewport, so centring matches what's
      // actually visible.
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden px-6 py-32"
    >
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-8">
        {/* span, not the default h2: the page H1 lives directly below. */}
        <SectionCounter index={0} labelKey="sections.hero" as="span" />
        <MonoLabel>{t('role')}</MonoLabel>
        {/* pb reserves room for the serif descenders (the `j` in Radivojević)
            that the tight 0.9 line-height would otherwise clip. */}
        <h1 className="font-display leading-[0.9] pb-[0.12em]">
          <Reveal as="span" delay={0}>
            <span
              className={`block ${NAME_SIZE} text-transparent [-webkit-text-stroke:1.5px_var(--color-fg)]`}
            >
              {t('nameFirst')}
            </span>
          </Reveal>
          {/* Real whitespace between the two name blocks: without it the H1
              serialises as one run-on token ("AleksandarRadivojević") for
              crawlers and screen readers. The children are `block`, so this
              text node has no visual effect. */}
          {' '}
          <Reveal as="span" delay={0.15}>
            <span className={`block ${NAME_SIZE} text-accent`}>{t('nameLast')}</span>
          </Reveal>
        </h1>
        <p className="max-w-xl text-base text-muted sm:text-lg">{t('tagline')}</p>
        <div>
          <BracketButton href="#work">{t('cta')}</BracketButton>
        </div>
      </div>
    </section>
  );
}
