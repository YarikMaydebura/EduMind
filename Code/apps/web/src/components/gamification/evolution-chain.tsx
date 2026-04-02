'use client';

import { ArrowRight, Check, Lock } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { RARITY_LABELS, RARITY_COLORS } from '@edumind/shared';

interface ChainNode {
  id: string;
  name: string;
  rarity: string;
}

interface EvolutionChainProps {
  chain: ChainNode[];
  currentClassId?: string;
}

export function EvolutionChain({ chain, currentClassId }: EvolutionChainProps) {
  if (chain.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chain.map((node, i) => {
        const isCurrent = node.id === currentClassId;
        const isPast = currentClassId
          ? chain.findIndex((n) => n.id === currentClassId) > i
          : false;
        const isFuture = !isCurrent && !isPast;
        const colorClass = RARITY_COLORS[node.rarity] ?? '';
        const label = RARITY_LABELS[node.rarity] ?? '';

        return (
          <div key={node.id} className="flex items-center gap-2">
            {i > 0 && (
              <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            )}
            <div
              className={`rounded-lg border px-3 py-1.5 text-center ${
                isCurrent
                  ? 'border-primary bg-primary/10 ring-1 ring-primary/30'
                  : isPast
                    ? 'border-muted-foreground/30 bg-muted/50'
                    : 'border-border opacity-50'
              }`}
            >
              <div className="flex items-center gap-1.5">
                {isPast && <Check className="h-3 w-3 text-green-500" />}
                {isFuture && <Lock className="h-3 w-3 text-muted-foreground" />}
                <span className={`text-xs font-semibold ${isCurrent ? 'text-primary' : ''}`}>
                  {node.name}
                </span>
              </div>
              <Badge
                variant="outline"
                className={`mt-0.5 text-[10px] ${colorClass}`}
              >
                {label}
              </Badge>
            </div>
          </div>
        );
      })}
    </div>
  );
}
