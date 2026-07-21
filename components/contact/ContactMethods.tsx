import { useTranslations } from 'next-intl';
import { BracketButton } from '@/components/ui/BracketButton';
import { SITE, phoneE164 } from '@/content/site';

const PHONE_HREF = `tel:${phoneE164()}`;

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
