export function GridBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(to right, var(--color-line) 1px, transparent 1px), linear-gradient(to bottom, var(--color-line) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />
      <div className="absolute inset-y-0 left-1/4 w-px border-l border-dashed border-line" />
      <div className="absolute inset-y-0 left-1/2 w-px border-l border-dashed border-line" />
      <div className="absolute inset-y-0 left-3/4 w-px border-l border-dashed border-line" />
    </div>
  );
}
