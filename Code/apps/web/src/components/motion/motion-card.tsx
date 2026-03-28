'use client';

import { motion } from 'framer-motion';

import { scaleOnHover } from '@/lib/motion';

export function MotionCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div {...scaleOnHover} className={className}>
      {children}
    </motion.div>
  );
}
