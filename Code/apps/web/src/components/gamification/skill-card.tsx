'use client';

import { Lock, Sparkles, Zap } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SKILL_RARITY_LABELS, SKILL_RARITY_COLORS, SKILL_TYPE_CONFIG } from '@edumind/shared';

interface SkillCardProps {
  name: string;
  type: string;
  rarity: string;
  description: string;
  mpCost: number;
  staCost: number;
  power: number;
  cooldown: number;
  isEquipped?: boolean;
  isLocked?: boolean;
  isLearned?: boolean;
  masteryLevel?: number;
  onClick?: () => void;
}

export function SkillCard({
  name,
  type,
  rarity,
  description,
  mpCost,
  staCost,
  power,
  cooldown,
  isEquipped = false,
  isLocked = false,
  isLearned = false,
  masteryLevel,
  onClick,
}: SkillCardProps) {
  const rarityColor = SKILL_RARITY_COLORS[rarity] ?? '';
  const rarityLabel = SKILL_RARITY_LABELS[rarity] ?? '';
  const typeConfig = SKILL_TYPE_CONFIG[type];

  return (
    <Card
      className={`transition-all ${
        isEquipped
          ? 'border-primary ring-2 ring-primary/20'
          : isLocked
            ? 'opacity-50'
            : 'cursor-pointer hover:shadow-md hover:border-primary/30'
      }`}
      onClick={!isLocked ? onClick : undefined}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {typeConfig && <span className="text-lg">{typeConfig.icon}</span>}
            <CardTitle className="text-sm">{name}</CardTitle>
          </div>
          <div className="flex items-center gap-1">
            {isEquipped && <Sparkles className="h-3.5 w-3.5 text-primary" />}
            {isLocked && <Lock className="h-3.5 w-3.5 text-muted-foreground" />}
            {isLearned && !isEquipped && <Zap className="h-3.5 w-3.5 text-green-500" />}
          </div>
        </div>
        <div className="flex gap-1">
          {typeConfig && (
            <Badge variant="outline" className={`text-[10px] ${typeConfig.color}`}>
              {typeConfig.label}
            </Badge>
          )}
          <Badge variant="outline" className={`text-[10px] ${rarityColor}`}>
            {rarityLabel}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-xs text-muted-foreground line-clamp-2">{description}</p>
        <div className="flex flex-wrap gap-2 text-[10px] text-muted-foreground">
          {mpCost > 0 && <span className="text-blue-400">{mpCost} MP</span>}
          {staCost > 0 && <span className="text-green-400">{staCost} STA</span>}
          {power > 0 && <span className="text-orange-400">{power}% PWR</span>}
          {cooldown > 0 && <span>{cooldown}T CD</span>}
        </div>
        {masteryLevel != null && (
          <div className="text-[10px] text-muted-foreground">
            Mastery Lv.{masteryLevel}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
