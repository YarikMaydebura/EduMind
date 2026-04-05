'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface DamageEvent {
  id: number;
  value: number;
  type: 'damage' | 'heal' | 'crit';
}

interface DamageNumbersProps {
  latestDamage: number | null;
  latestHealing: number | null;
  isCrit: boolean;
}

let counter = 0;

export function DamageNumbers({ latestDamage, latestHealing, isCrit }: DamageNumbersProps) {
  const [events, setEvents] = useState<DamageEvent[]>([]);

  useEffect(() => {
    if (latestDamage && latestDamage > 0) {
      const id = ++counter;
      setEvents((prev) => [...prev, { id, value: latestDamage, type: isCrit ? 'crit' : 'damage' }]);
      setTimeout(() => setEvents((prev) => prev.filter((e) => e.id !== id)), 1500);
    }
  }, [latestDamage, isCrit]);

  useEffect(() => {
    if (latestHealing && latestHealing > 0) {
      const id = ++counter;
      setEvents((prev) => [...prev, { id, value: latestHealing, type: 'heal' }]);
      setTimeout(() => setEvents((prev) => prev.filter((e) => e.id !== id)), 1500);
    }
  }, [latestHealing]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <AnimatePresence>
        {events.map((event) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 1, y: 0, scale: event.type === 'crit' ? 1.5 : 1 }}
            animate={{ opacity: 0, y: -60 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className={`absolute left-1/2 top-1/2 -translate-x-1/2 text-lg font-bold ${
              event.type === 'crit'
                ? 'text-amber-400 text-2xl'
                : event.type === 'heal'
                  ? 'text-green-400'
                  : 'text-red-400'
            }`}
          >
            {event.type === 'heal' ? '+' : '-'}{event.value}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
