'use client';

import { Badge } from '@/components/ui/badge';

interface ClassAbility {
  name: string;
  description: string;
  type: 'passive' | 'active';
  icon: string;
  effects: string;
}

interface ClassAbilitiesProps {
  abilities: ClassAbility[];
}

export function ClassAbilities({ abilities }: ClassAbilitiesProps) {
  if (!abilities || abilities.length === 0) return null;

  return (
    <div className="space-y-2">
      {abilities.map((ability) => (
        <div
          key={ability.name}
          className="flex items-start gap-3 rounded-lg border p-3"
        >
          <span className="mt-0.5 text-lg">{ability.icon}</span>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">{ability.name}</span>
              <Badge
                variant={ability.type === 'passive' ? 'secondary' : 'outline'}
                className="text-[10px]"
              >
                {ability.type === 'passive' ? 'Passive' : 'Active'}
              </Badge>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">{ability.description}</p>
            <p className="mt-0.5 text-xs font-medium text-primary">{ability.effects}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
