import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Reveal } from '@/components/ui/Reveal';
import { Tag } from '@/components/ui/Tag';
import { MonoLabel } from '@/components/ui/MonoLabel';
import { BracketButton } from '@/components/ui/BracketButton';
import { SKEDIO_CASE } from '@/content/work';

// The full Skedio case-study body. Kept a plain synchronous Server Component
// (directly renderable in tests) like CaseCajs.tsx — the async route page
// handles setRequestLocale.
export function CaseSkedio() {
  const t = useTranslations('caseSkedio');

  const STAT_KEYS = ['loc', 'screens', 'endpoints', 'migrations', 'integrations'] as const;

  return (
    <section className="relative px-6 py-32">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-16">
        <div>
          <BracketButton as={Link} href="/#work">
            {t('hero.backLabel')}
          </BracketButton>
        </div>

        {/* Hero */}
        <Reveal>
          <div className="flex flex-col gap-8">
            <MonoLabel>{t('hero.kicker')}</MonoLabel>
            <h1 className="font-display text-4xl leading-[0.95] text-fg sm:text-6xl">
              {t('hero.title')}
            </h1>
            <p className="max-w-2xl text-base text-muted sm:text-lg">{t('hero.tagline')}</p>
            <span className="w-fit border border-accent px-3 py-1 font-mono text-xs uppercase tracking-[0.2em] text-accent">
              {t('hero.statusTag')}
            </span>
            <div className="flex flex-wrap gap-2">
              {SKEDIO_CASE.stack.map((tech) => (
                <Tag key={tech}>{tech}</Tag>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <BracketButton href={SKEDIO_CASE.landing} target="_blank" rel="noopener noreferrer">
                {t('hero.landingLabel')}
              </BracketButton>
              <BracketButton href={SKEDIO_CASE.app} target="_blank" rel="noopener noreferrer">
                {t('hero.appLabel')}
              </BracketButton>
            </div>
          </div>
        </Reveal>

        {/* The problem */}
        <div className="flex flex-col gap-6">
          <h2 className="font-display text-2xl text-fg sm:text-3xl">{t('sections.problem')}</h2>
          <p className="max-w-2xl text-base text-muted sm:text-lg">{t('problem.body')}</p>
        </div>

        {/* What I built */}
        <div className="flex flex-col gap-6">
          <h2 className="font-display text-2xl text-fg sm:text-3xl">{t('sections.features')}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {SKEDIO_CASE.features.map((key, i) => (
              <Reveal key={key} delay={i * 0.05}>
                <div className="flex h-full flex-col gap-3 border border-line p-6">
                  <span className="font-mono text-xs text-muted">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="font-display text-lg text-fg sm:text-xl">{t(`features.${key}.title`)}</h3>
                  <p className="text-sm text-muted sm:text-base">{t(`features.${key}.body`)}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* How it's engineered */}
        <div className="flex flex-col gap-6">
          <h2 className="font-display text-2xl text-fg sm:text-3xl">{t('sections.engineering')}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {SKEDIO_CASE.engineering.map((key, i) => (
              <Reveal key={key} delay={i * 0.05}>
                <div className="flex h-full flex-col gap-3 border border-line p-6">
                  <h3 className="font-display text-lg text-fg sm:text-xl">{t(`engineering.${key}.title`)}</h3>
                  <p className="text-sm text-muted sm:text-base">{t(`engineering.${key}.body`)}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* By the numbers */}
        <div className="flex flex-col gap-6">
          <h2 className="font-display text-2xl text-fg sm:text-3xl">{t('sections.stats')}</h2>
          <Reveal>
            <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {STAT_KEYS.map((key) => (
                <div key={key} className="flex flex-col gap-2 border border-line p-4">
                  <dd className="font-mono text-lg text-fg sm:text-xl">{SKEDIO_CASE.stats[key]}</dd>
                  <dt className="font-mono text-xs uppercase tracking-[0.2em] text-muted">{t(`stat.${key}`)}</dt>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        {/* Screenshots */}
        <div className="flex flex-col gap-6">
          <h2 className="font-display text-2xl text-fg sm:text-3xl">{t('sections.screenshots')}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {SKEDIO_CASE.screenshots.map((shot, i) => (
              <Reveal key={shot.src} delay={i * 0.05}>
                <div className={`relative ${shot.aspect} overflow-hidden border border-line bg-black/20`}>
                  <Image
                    src={shot.src}
                    alt={t(`shots.${shot.altKey}`)}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-contain"
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Status & what's next */}
        <div className="flex flex-col gap-6">
          <h2 className="font-display text-2xl text-fg sm:text-3xl">{t('sections.status')}</h2>
          <p className="max-w-2xl text-base text-muted sm:text-lg">{t('status.body')}</p>
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
