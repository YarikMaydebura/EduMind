'use client';

import { Loader2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { ActionBar } from '@/components/battle/action-bar';
import { BattleLog } from '@/components/battle/battle-log';
import { BattleResult } from '@/components/battle/battle-result';
import { DamageNumbers } from '@/components/battle/damage-number';
import { FighterPanel } from '@/components/battle/fighter-panel';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface FighterState {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  sta: number;
  maxSta: number;
  atk: number;
  def: number;
  spd: number;
  lck: number;
  skills: Array<{
    id: string;
    name: string;
    type: string;
    mpCost: number;
    staCost: number;
    power: number;
    hitCount: number;
    cooldown: number;
  }>;
  cooldowns: Record<string, number>;
  statusEffects: Array<{ type: string; stat?: string; value: number; turnsRemaining: number }>;
  isDefending: boolean;
}

interface LogEntry {
  turn: number;
  actorId: string;
  action: string;
  damage?: number;
  healing?: number;
  isCrit?: boolean;
  isDodged?: boolean;
  statusApplied?: string;
  message: string;
}

interface BattleState {
  turn: number;
  maxTurns: number;
  player1: FighterState;
  player2: FighterState;
  log: LogEntry[];
  status: 'IN_PROGRESS' | 'P1_WIN' | 'P2_WIN' | 'DRAW';
}

export function BattleScreen({ battleId }: { battleId: string }) {
  const router = useRouter();
  const [state, setState] = useState<BattleState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActing, setIsActing] = useState(false);
  const [latestDamage, setLatestDamage] = useState<number | null>(null);
  const [latestHealing, setLatestHealing] = useState<number | null>(null);
  const [latestCrit, setLatestCrit] = useState(false);
  const [rewards, setRewards] = useState<{ player1XP: number; player1KP: number } | null>(null);

  const loadBattle = useCallback(async () => {
    try {
      const res = await fetch(`/api/battles/${battleId}`);
      const json = await res.json();
      if (json.success) {
        // battleLog contains the full BattleState
        setState(json.data.battleLog as BattleState);
        if (json.data.rewards) {
          setRewards(json.data.rewards);
        }
      }
    } catch {
      toast.error('Failed to load battle');
    } finally {
      setIsLoading(false);
    }
  }, [battleId]);

  useEffect(() => {
    void loadBattle();
  }, [loadBattle]);

  async function handleAction(action: string, skillId?: string) {
    if (isActing || !state || state.status !== 'IN_PROGRESS') return;
    setIsActing(true);

    try {
      const res = await fetch(`/api/battles/${battleId}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, skillId }),
      });

      const json = await res.json();
      if (json.success) {
        const newState = json.data.state as BattleState;

        // Find latest damage/healing from new log entries
        const newEntries = newState.log.slice(state.log.length);
        const lastDmgEntry = newEntries.find((e) => e.damage && e.damage > 0);
        const lastHealEntry = newEntries.find((e) => e.healing && e.healing > 0);

        if (lastDmgEntry) {
          setLatestDamage(lastDmgEntry.damage ?? null);
          setLatestCrit(lastDmgEntry.isCrit ?? false);
        }
        if (lastHealEntry) {
          setLatestHealing(lastHealEntry.healing ?? null);
        }

        setState(newState);

        if (json.data.isFinished) {
          // Reload to get rewards
          await loadBattle();
        }
      } else {
        toast.error(json.message || 'Action failed');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setIsActing(false);
    }
  }

  async function handleForfeit() {
    if (!confirm('Are you sure you want to forfeit?')) return;
    try {
      const res = await fetch(`/api/battles/${battleId}/forfeit`, { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        toast.info('Battle forfeited');
        router.push('/s/battles');
      }
    } catch {
      toast.error('Failed to forfeit');
    }
  }

  if (isLoading || !state) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Show result screen if battle ended
  if (state.status !== 'IN_PROGRESS') {
    return (
      <div className="container max-w-lg py-8">
        <BattleResult status={state.status} rewards={rewards} />
      </div>
    );
  }

  return (
    <div className="container max-w-lg py-4">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <Badge variant="outline" className="text-sm">
          Turn {state.turn}/{state.maxTurns}
        </Badge>
        <Button variant="ghost" size="sm" className="text-xs text-muted-foreground" onClick={handleForfeit}>
          <X className="mr-1 h-3 w-3" /> Forfeit
        </Button>
      </div>

      {/* Battle area */}
      <div className="relative space-y-3">
        {/* Opponent (top) */}
        <FighterPanel
          name={state.player2.name}
          hp={state.player2.hp}
          maxHp={state.player2.maxHp}
          mp={state.player2.mp}
          maxMp={state.player2.maxMp}
          sta={state.player2.sta}
          maxSta={state.player2.maxSta}
          statusEffects={state.player2.statusEffects}
          isDefending={state.player2.isDefending}
          isOpponent
        />

        {/* Damage numbers overlay */}
        <DamageNumbers latestDamage={latestDamage} latestHealing={latestHealing} isCrit={latestCrit} />

        {/* VS divider */}
        <div className="flex items-center justify-center py-1">
          <div className="h-px flex-1 bg-border" />
          <span className="mx-3 text-xs font-bold text-muted-foreground">VS</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        {/* Player (bottom) */}
        <FighterPanel
          name={state.player1.name}
          hp={state.player1.hp}
          maxHp={state.player1.maxHp}
          mp={state.player1.mp}
          maxMp={state.player1.maxMp}
          sta={state.player1.sta}
          maxSta={state.player1.maxSta}
          statusEffects={state.player1.statusEffects}
          isDefending={state.player1.isDefending}
        />
      </div>

      {/* Action bar */}
      <div className="mt-4">
        <ActionBar
          skills={state.player1.skills}
          cooldowns={state.player1.cooldowns}
          playerMp={state.player1.mp}
          playerSta={state.player1.sta}
          disabled={isActing}
          onAttack={() => handleAction('ATTACK')}
          onDefend={() => handleAction('DEFEND')}
          onSkill={(skillId) => handleAction('SKILL', skillId)}
        />
      </div>

      {/* Battle log */}
      <div className="mt-4">
        <BattleLog entries={state.log} />
      </div>
    </div>
  );
}
