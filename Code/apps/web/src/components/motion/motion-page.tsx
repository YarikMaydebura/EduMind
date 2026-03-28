'use client';

import { motion } from 'framer-motion';

import { pageVariants, pageTransition } from '@/lib/motion';

export function MotionPage({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      transition={pageTransition}
      className={className}
    >
      {children}
    </motion.div>
  );
}
