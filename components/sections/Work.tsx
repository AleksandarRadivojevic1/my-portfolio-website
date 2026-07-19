import { useTranslations } from 'next-intl';
import { SectionCounter } from '@/components/ui/SectionCounter';
import { Reveal } from '@/components/ui/Reveal';
import { FeaturedCase } from '@/components/work/FeaturedCase';
import { ProductCard } from '@/components/work/ProductCard';
import { TestimonialSlot } from '@/components/work/TestimonialSlot';

export function Work() {
  const t = useTranslations('work');

  return (
    <section id="work" className="relative px-6 py-32">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-16">
        <SectionCounter index={3} labelKey="sections.work" />

        <p className="max-w-2xl text-base text-fg sm:text-lg">{t('intro')}</p>

        <Reveal>
          <FeaturedCase />
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2">
          <Reveal>
            <ProductCard />
          </Reveal>
          <Reveal delay={0.1}>
            <TestimonialSlot />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
