import { useTranslations } from 'next-intl';

type SectionCounterProps = {
  index: number;
  labelKey: string;
};

export function SectionCounter({ index, labelKey }: SectionCounterProps) {
  const t = useTranslations();

  return (
    <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
      {String(index).padStart(2, '0')} · {t(labelKey)}
    </span>
  );
}
