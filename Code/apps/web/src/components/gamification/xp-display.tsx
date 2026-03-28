'use client';

import { animate } from 'framer-motion';
import { Star } from 'lucide-react';
import { useEffect, useRef } from 'react';

import { cn } from '@/lib/utils';

interface XPDisplayProps {
  xp: number;
  variant?: 'compact' | 'full';
  className?: string;
  animated?: boolean;
}

export function XPDisplay({ xp, variant = 'full', className, animated = true }: XPDisplayProps) {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const prevXp = useRef(xp);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node || !animated) return;

    const from = prevXp.current;
    prevXp.current = xp;
    if (from === xp) return;

    const controls = animate(from, xp, {
      duration: 0.8,
      ease: 'easeOut',
      onUpdate: (value) => {
        node.textContent = Math.round(value).toLocaleString();
      },
    });

    return () => controls.stop();
  }, [xp, animated]);

  const formatted = xp.toLocaleString();

  if (variant === 'compact') {
    return (
      <span className={cn('inline-flex items-center gap-1 text-yellow-600', className)}>
        <Star className="h-3.5 w-3.5 fill-current" />
        <span ref={nodeRef}>{formatted}</span>
      </span>
    );
  }

  return (
    <span className={cn('inline-flex items-center gap-1.5 font-medium text-yellow-600', className)}>
      <Star className="h-4 w-4 fill-current" />
      <span ref={nodeRef}>{formatted}</span> XP
    </span>
  );
}
