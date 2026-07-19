import { useTranslations } from 'next-intl';
import { SectionCounter } from '@/components/ui/SectionCounter';
import { Reveal } from '@/components/ui/Reveal';

const TAG_KEYS = ['t1', 't2', 't3'] as const;
const STAT_KEYS = ['s1', 's2', 's3'] as const;
const FOUNDATION_KEYS = ['f1', 'f3', 'f4'] as const;

export function About() {
  const t = useTranslations('about');

  return (
    <section id="about" className="relative px-6 py-40">
      {/* Editorial margin label — the section as a running system channel. */}
      <span className="pointer-events-none absolute left-8 top-44 hidden font-mono text-[10px] uppercase tracking-[0.5em] text-muted [writing-mode:vertical-rl] xl:block">
        01 / About
      </span>

      <div className="mx-auto flex w-full max-w-5xl flex-col gap-24">
        <SectionCounter index={1} labelKey="sections.about" />

        {/* Lead statement + stats, asymmetric. */}
        <div className="grid gap-14 md:grid-cols-[1.5fr_1fr] md:gap-20">
          <p className="max-w-2xl text-2xl font-light leading-[1.35] text-fg sm:text-3xl">
            {t('bio')}
          </p>

          <dl className="flex flex-col justify-end gap-8">
            {STAT_KEYS.map((key) => (
              <div key={key} className="flex flex-col gap-1">
                <dd className="font-display text-4xl leading-none text-fg sm:text-5xl">
                  {t(`stats.${key}.value`)}
                </dd>
                <dt className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted">
                  {t(`stats.${key}.label`)}
                </dt>
              </div>
            ))}
          </dl>
        </div>

        {/* Metadata line — no boxed pills. */}
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted">
          {TAG_KEYS.map((key) => t(`tags.${key}`)).join('  /  ')}
        </p>

        {/* Foundations as a spec-sheet list: hairline dividers, no boxes. */}
        <div className="flex flex-col">
          {FOUNDATION_KEYS.map((key, i) => (
            <Reveal key={key} delay={i * 0.08}>
              <div className="grid grid-cols-1 gap-3 border-t border-line py-10 last:border-b md:grid-cols-12 md:gap-8">
                <span className="font-mono text-sm text-accent md:col-span-1">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="font-display text-2xl leading-tight text-fg sm:text-3xl md:col-span-5">
                  {t(`foundations.${key}.title`)}
                </h3>
                <p className="max-w-prose text-base leading-relaxed text-muted sm:text-lg md:col-span-6">
                  {t(`foundations.${key}.body`)}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
