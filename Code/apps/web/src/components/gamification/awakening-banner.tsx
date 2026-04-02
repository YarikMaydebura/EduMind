'use client';

import { motion } from 'framer-motion';
import { Swords, Zap } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

export function AwakeningBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-xl border-2 border-purple-500/30 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-purple-500/10 p-4"
    >
      <div className="flex items-center gap-4">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 text-white shadow-lg"
        >
          <Swords className="h-6 w-6" />
        </motion.div>
        <div className="flex-1">
          <h3 className="font-bold">Your Battle Character Awaits!</h3>
          <p className="text-sm text-muted-foreground">
            You&apos;ve reached Level 5. Choose your theme and class to unlock the battle system.
          </p>
        </div>
        <Button asChild size="sm" className="shrink-0">
          <Link href="/s/awakening">
            <Zap className="mr-1 h-3.5 w-3.5" />
            Awaken
          </Link>
        </Button>
      </div>
    </motion.div>
  );
}
