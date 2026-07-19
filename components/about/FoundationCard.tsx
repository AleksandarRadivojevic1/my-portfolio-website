type FoundationCardProps = {
  index: number;
  title: string;
  body: string;
};

export function FoundationCard({ index, title, body }: FoundationCardProps) {
  return (
    <div className="flex h-full flex-col gap-4 border border-line p-6">
      <span className="font-mono text-xs text-muted">{String(index).padStart(2, '0')}</span>
      <h3 className="font-display text-xl text-fg sm:text-2xl">{title}</h3>
      <p className="text-sm text-muted sm:text-base">{body}</p>
    </div>
  );
}
