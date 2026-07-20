import { useTranslations } from 'next-intl';
import { PROCESS_STEPS } from '@/content/services';
import { ProcessAccordion } from './ProcessAccordion';

export function ProcessSteps() {
  const t = useTranslations('services.process');

  // Resolve copy on the server, hand plain strings to the client accordion.
  const steps = PROCESS_STEPS.map((step) => ({
    id: step.id,
    n: String(step.step).padStart(2, '0'),
    title: t(`${step.id}.title`),
    body: t(`${step.id}.body`),
  }));

  return <ProcessAccordion steps={steps} />;
}
