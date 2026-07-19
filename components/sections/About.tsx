import { useTranslations } from 'next-intl';
import { SectionCounter } from '@/components/ui/SectionCounter';
import { Reveal } from '@/components/ui/Reveal';
import { Tag } from '@/components/ui/Tag';
import { FoundationCard } from '@/components/about/FoundationCard';

const TAG_KEYS = ['t1', 't2', 't3'] as const;
const STAT_KEYS = ['s1', 's2', 's3'] as const;
const FOUNDATION_KEYS = ['f1', 'f2', 'f3', 'f4'] as const;

export function About() {
  const t = useTranslations('about');

  return (
    <section id="about" className="relative px-6 py-32">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-16">
        <SectionCounter index={1} labelKey="sections.about" />

        <div className="grid gap-12 md:grid-cols-2 md:gap-16">
          <div className="flex flex-col gap-6">
            <p className="max-w-xl text-base text-fg sm:text-lg">{t('bio')}</p>
            <div className="flex flex-wrap gap-2">
              {TAG_KEYS.map((key) => (
                <Tag key={key}>{t(`tags.${key}`)}</Tag>
              ))}
            </div>
          </div>

          <dl className="flex flex-col gap-6 sm:flex-row sm:gap-10 md:flex-col md:gap-6">
            {STAT_KEYS.map((key) => (
              <div key={key} className="flex flex-col gap-1">
                <dd className="font-display text-3xl text-fg sm:text-4xl">
                  {t(`stats.${key}.value`)}
                </dd>
                <dt className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
                  {t(`stats.${key}.label`)}
                </dt>
              </div>
            ))}
          </dl>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {FOUNDATION_KEYS.map((key, i) => (
            <Reveal key={key} delay={i * 0.1}>
              <FoundationCard
                index={i + 1}
                title={t(`foundations.${key}.title`)}
                body={t(`foundations.${key}.body`)}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
