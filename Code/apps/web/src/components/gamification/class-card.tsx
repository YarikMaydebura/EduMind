'use client';

import { Lock, Sparkles } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RARITY_LABELS, RARITY_COLORS } from '@edumind/shared';

interface ClassCardProps {
  name: string;
  rarity: string;
  description: string;
  passives: Record<string, number>;
  isEquipped?: boolean;
  isLocked?: boolean;
  onClick?: () => void;
}

export function ClassCard({
  name,
  rarity,
  description,
  passives,
  isEquipped = false,
  isLocked = false,
  onClick,
}: ClassCardProps) {
  const colorClass = RARITY_COLORS[rarity] ?? 'text-gray-400 border-gray-400';
  const label = RARITY_LABELS[rarity] ?? rarity.replace('CLASS_', '');

  return (
    <Card
      className={`transition-all ${
        isEquipped
          ? 'border-primary ring-2 ring-primary/20'
          : isLocked
            ? 'opacity-60'
            : 'cursor-pointer hover:shadow-md hover:border-primary/30'
      }`}
      onClick={!isLocked ? onClick : undefined}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base">{name}</CardTitle>
          <div className="flex items-center gap-1">
            {isEquipped && (
              <Badge variant="default" className="text-xs">
                <Sparkles className="mr-1 h-3 w-3" /> Equipped
              </Badge>
            )}
            {isLocked && <Lock className="h-4 w-4 text-muted-foreground" />}
          </div>
        </div>
        <Badge variant="outline" className={`w-fit text-xs ${colorClass}`}>
          {label}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-xs text-muted-foreground">{description}</p>
        <div className="flex flex-wrap gap-1">
          {Object.entries(passives).map(([stat, val]) => (
            <Badge key={stat} variant="secondary" className="text-xs">
              +{Math.round(val * 100)}% {stat}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
