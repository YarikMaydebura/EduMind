'use client';

import { Shield, Swords } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { SKILL_TYPE_CONFIG } from '@edumind/shared';

interface EquippedSkill {
  id: string;
  name: string;
  type: string;
  mpCost: number;
  staCost: number;
  power: number;
  cooldown: number;
}

interface ActionBarProps {
  skills: EquippedSkill[];
  cooldowns: Record<string, number>;
  playerMp: number;
  playerSta: number;
  disabled: boolean;
  onAttack: () => void;
  onDefend: () => void;
  onSkill: (skillId: string) => void;
}

export function ActionBar({
  skills,
  cooldowns,
  playerMp,
  playerSta,
  disabled,
  onAttack,
  onDefend,
  onSkill,
}: ActionBarProps) {
  return (
    <div className="space-y-2">
      {/* Basic actions */}
      <div className="flex gap-2">
        <Button
          variant="default"
          size="sm"
          className="flex-1"
          disabled={disabled}
          onClick={onAttack}
        >
          <Swords className="mr-1.5 h-3.5 w-3.5" />
          Attack
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          disabled={disabled}
          onClick={onDefend}
        >
          <Shield className="mr-1.5 h-3.5 w-3.5" />
          Defend
        </Button>
      </div>

      {/* Skill buttons */}
      {skills.length > 0 && (
        <TooltipProvider delayDuration={200}>
          <div className="grid grid-cols-3 gap-1.5">
            {skills.map((skill) => {
              const cd = cooldowns[skill.id] ?? 0;
              const canAffordMp = playerMp >= skill.mpCost;
              const canAffordSta = playerSta >= skill.staCost;
              const canUse = cd === 0 && canAffordMp && canAffordSta && !disabled;
              const typeConfig = SKILL_TYPE_CONFIG[skill.type];

              return (
                <Tooltip key={skill.id}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className={`relative text-xs ${!canUse ? 'opacity-50' : ''}`}
                      disabled={!canUse}
                      onClick={() => onSkill(skill.id)}
                    >
                      <span className="mr-1">{typeConfig?.icon ?? '⚔️'}</span>
                      <span className="truncate">{skill.name}</span>
                      {cd > 0 && (
                        <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-muted text-[9px] font-bold">
                          {cd}
                        </span>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs">
                    <p className="font-semibold">{skill.name}</p>
                    <div className="flex gap-2 text-muted-foreground">
                      {skill.mpCost > 0 && <span className="text-blue-400">{skill.mpCost} MP</span>}
                      {skill.staCost > 0 && <span className="text-green-400">{skill.staCost} STA</span>}
                      {skill.power > 0 && <span className="text-orange-400">{skill.power}% PWR</span>}
                      {skill.cooldown > 0 && <span>{skill.cooldown}T CD</span>}
                    </div>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </TooltipProvider>
      )}
    </div>
  );
}
