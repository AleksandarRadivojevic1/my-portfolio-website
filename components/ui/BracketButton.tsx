import type { ComponentPropsWithoutRef, ComponentType, ElementType, ReactNode } from 'react';

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
  // A bare `ElementType` is a union of every possible tag/component, so JSX
  // intersects their props and collapses `children`/`href` to `never`. Every
  // caller renders an anchor-shaped target (the default `<a>` or `as={Link}`),
  // so we pin `Comp` to a single concrete anchor-props component. That keeps
  // the component polymorphic while giving the JSX below one prop shape to
  // check against — href, className, children and the spread `...rest` all fit.
  const Comp = (as ?? 'a') as ComponentType<ComponentPropsWithoutRef<'a'>>;

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
