import { useTranslations } from 'next-intl';
import { SectionCounter } from '@/components/ui/SectionCounter';
import { Reveal } from '@/components/ui/Reveal';
import { ContactMethods } from '@/components/contact/ContactMethods';

export function Contact() {
  const t = useTranslations('contact');

  return (
    <section id="contact" className="relative px-6 py-32">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-16">
        <SectionCounter index={4} labelKey="sections.contact" />

        <div className="flex flex-col gap-4">
          <p className="max-w-2xl text-base text-fg sm:text-lg">{t('intro')}</p>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
            {t('consult')}
          </p>
        </div>

        <Reveal>
          <ContactMethods />
        </Reveal>
      </div>
    </section>
  );
}
