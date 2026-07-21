import { useTranslations } from 'next-intl';
import { FAQ } from '@/content/faq';
import { FaqAccordion } from './FaqAccordion';

export function Faq() {
  const t = useTranslations('services.faq');

  // Resolve copy on the server, hand plain strings to the client accordion.
  const items = FAQ.map((entry) => ({
    id: entry.id,
    question: t(`${entry.id}.question`),
    answer: t(`${entry.id}.answer`),
  }));

  return <FaqAccordion items={items} />;
}
