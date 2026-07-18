'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ElementType, ReactNode } from 'react';

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
};

export function Reveal({ children, as = 'div', delay = 0 }: RevealProps) {
  const shouldReduceMotion = useReducedMotion();
  const Comp = as;

  if (shouldReduceMotion) {
    return <Comp>{children}</Comp>;
  }

  const MotionComp = motion[Comp as keyof typeof motion] as typeof motion.div;

  return (
    <MotionComp
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </MotionComp>
  );
}
