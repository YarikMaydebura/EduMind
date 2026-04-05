'use client';

import { motion } from 'framer-motion';

import { Badge } from '@/components/ui/badge';

import { StatusEffectBadge } from './status-effect-badge';

interface StatusEffect {
  type: string;
  stat?: string;
  value: number;
  turnsRemaining: number;
}

interface FighterPanelProps {
  name: string;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  sta: number;
  maxSta: number;
  statusEffects: StatusEffect[];
  isDefending: boolean;
  isOpponent?: boolean;
}

function ResourceBar({
  label,
  value,
  max,
  color,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
}) {
  const pct = max > 0 ? Math.max(0, (value / max) * 100) : 0;

  return (
    <div className="space-y-0.5">
      <div className="flex items-center justify-between text-[10px]">
        <span className="font-medium text-muted-foreground">{label}</span>
        <span className="font-bold">
          {value}/{max}
        </span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

export function FighterPanel({
  name,
  hp,
  maxHp,
  mp,
  maxMp,
  sta,
  maxSta,
  statusEffects,
  isDefending,
  isOpponent = false,
}: FighterPanelProps) {
  return (
    <div
      className={`rounded-xl border p-3 ${
        isOpponent ? 'border-red-500/20 bg-red-500/5' : 'border-blue-500/20 bg-blue-500/5'
      }`}
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-bold">{name}</span>
        <div className="flex items-center gap-1">
          {isDefending && (
            <Badge variant="outline" className="text-[10px]">
              🛡️ Defending
            </Badge>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <ResourceBar label="HP" value={hp} max={maxHp} color="bg-red-500" />
        <ResourceBar label="MP" value={mp} max={maxMp} color="bg-blue-500" />
        <ResourceBar label="STA" value={sta} max={maxSta} color="bg-green-500" />
      </div>

      {statusEffects.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {statusEffects.map((effect, i) => (
            <StatusEffectBadge key={i} type={effect.type} turnsRemaining={effect.turnsRemaining} stat={effect.stat} />
          ))}
        </div>
      )}
    </div>
  );
}
