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

  // On hover/focus the brackets pull apart, the arrow advances toward the
  // closing bracket, and an amber rule wipes in under the label — the button
  // reacting like a terminal prompt rather than just changing colour. Each
  // piece is its own span so `gap-1` still supplies the "[ label → ]" spacing.
  const MOTION = 'transition-transform duration-300 ease-out motion-reduce:transition-none';

  return (
    <Comp
      href={href}
      className={`group inline-flex items-center gap-1 font-mono text-sm text-fg transition-colors hover:text-accent ${FOCUS_RING} ${className}`}
      {...rest}
    >
      <span
        aria-hidden
        className={`${MOTION} group-hover:-translate-x-1 group-focus-visible:-translate-x-1`}
      >
        [
      </span>

      <span className="relative">
        {children}
        <span
          aria-hidden
          className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-300 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none"
        />
      </span>

      <span
        aria-hidden
        className={`${MOTION} group-hover:translate-x-0.5 group-focus-visible:translate-x-0.5`}
      >
        →
      </span>

      <span
        aria-hidden
        className={`${MOTION} group-hover:translate-x-1 group-focus-visible:translate-x-1`}
      >
        ]
      </span>
    </Comp>
  );
}
