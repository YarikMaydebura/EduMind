'use client';

import { Badge } from '@/components/ui/badge';

const STATUS_ICONS: Record<string, string> = {
  BURN: '🔥',
  POISON: '☠️',
  FREEZE: '❄️',
  SHOCK: '⚡',
  BUFF: '💪',
  DEBUFF: '💔',
};

interface StatusEffectBadgeProps {
  type: string;
  turnsRemaining: number;
  stat?: string;
}

export function StatusEffectBadge({ type, turnsRemaining, stat }: StatusEffectBadgeProps) {
  const icon = STATUS_ICONS[type] ?? '✨';
  const label = stat ? `${type} ${stat}` : type;

  return (
    <Badge variant="outline" className="text-[10px] gap-0.5">
      <span>{icon}</span>
      <span>{label}</span>
      <span className="text-muted-foreground">({turnsRemaining}t)</span>
    </Badge>
  );
}
