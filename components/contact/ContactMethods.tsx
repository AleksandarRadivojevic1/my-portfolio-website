import { useTranslations } from 'next-intl';
import { BracketButton } from '@/components/ui/BracketButton';
import { SITE } from '@/content/site';

// SITE.phone is stored as a local Serbian number ("061 230 8522") for
// display. `tel:` hrefs need an E.164-ish absolute form, so the leading
// trunk "0" is swapped for the +381 country code and whitespace stripped.
const PHONE_HREF = `tel:+381${SITE.phone.replace(/^0/, '').replace(/\s+/g, '')}`;

export function ContactMethods() {
  const t = useTranslations('contact');

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:gap-6">
      <BracketButton href={`mailto:${SITE.email}`} className="text-base sm:text-lg">
        {t('emailLabel')}: {SITE.email}
      </BracketButton>
      <BracketButton href={PHONE_HREF} className="text-base sm:text-lg">
        {t('phoneLabel')}: {SITE.phone}
      </BracketButton>
    </div>
  );
}
