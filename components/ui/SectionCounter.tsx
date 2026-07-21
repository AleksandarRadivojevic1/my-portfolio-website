import { useTranslations } from 'next-intl';

type SectionCounterProps = {
  index: number;
  labelKey: string;
  /**
   * Element to render. Defaults to `h2` — this label *is* the section's
   * visible title, so it's the natural heading and gives the page an
   * H1 → H2 → H3 outline. Hero passes `span`: it already owns the page H1,
   * and an h2 there would sit above the h1 in document order.
   */
  as?: 'h2' | 'span';
};

export function SectionCounter({ index, labelKey, as: Tag = 'h2' }: SectionCounterProps) {
  const t = useTranslations();

  return (
    <Tag className="font-mono text-xs font-normal uppercase tracking-[0.2em] text-muted">
      {String(index).padStart(2, '0')} · {t(labelKey)}
    </Tag>
  );
}
