import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';

type BracketButtonProps = {
  href?: string;
  children: ReactNode;
  as?: ElementType;
  className?: string;
} & Omit<ComponentPropsWithoutRef<'a'>, 'href' | 'children' | 'className'>;

const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg';

export function BracketButton({
  href,
  children,
  as,
  className = '',
  ...rest
}: BracketButtonProps) {
  const Comp = as ?? 'a';

  return (
    <Comp
      href={href}
      className={`inline-flex items-center gap-1 font-mono text-sm text-fg transition-colors hover:text-accent ${FOCUS_RING} ${className}`}
      {...rest}
    >
      [ {children} → ]
    </Comp>
  );
}
