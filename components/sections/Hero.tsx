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
      className="relative flex min-h-screen flex-col justify-center overflow-hidden px-6 py-32"
    >
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-8">
        <SectionCounter index={0} labelKey="sections.hero" />
        <MonoLabel>{t('role')}</MonoLabel>
        <h1 className="font-display leading-[0.9]">
          <Reveal as="span" delay={0}>
            <span
              className={`block ${NAME_SIZE} text-transparent [-webkit-text-stroke:1.5px_var(--color-fg)]`}
            >
              {t('nameFirst')}
            </span>
          </Reveal>
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
