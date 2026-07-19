import { useTranslations } from 'next-intl';
import { SectionCounter } from '@/components/ui/SectionCounter';
import { Reveal } from '@/components/ui/Reveal';
import { ContactForm } from '@/components/contact/ContactForm';

export function Contact() {
  const t = useTranslations('contact');

  return (
    <section id="contact" className="relative px-6 py-32">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-16">
        <SectionCounter index={4} labelKey="sections.contact" />

        <p className="max-w-2xl text-base text-fg sm:text-lg">{t('intro')}</p>

        <Reveal>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}
