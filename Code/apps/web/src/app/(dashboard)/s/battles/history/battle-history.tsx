'use client';

import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface BattleHistoryItem {
  id: string;
  type: string;
  result: 'WIN' | 'LOSS' | 'DRAW' | 'FORFEIT';
  xpEarned: number;
  kpEarned: number;
  date: string;
}

const resultConfig = {
  WIN: { color: 'text-green-500', bg: 'bg-green-500/10', icon: '🏆', label: 'Victory' },
  LOSS: { color: 'text-red-500', bg: 'bg-red-500/10', icon: '💀', label: 'Defeat' },
  DRAW: { color: 'text-gray-500', bg: 'bg-gray-500/10', icon: '⚖️', label: 'Draw' },
  FORFEIT: { color: 'text-orange-500', bg: 'bg-orange-500/10', icon: '🏳️', label: 'Forfeit' },
};

const typeLabels: Record<string, string> = {
  PVP: 'PvP',
  PVE_DUNGEON: 'Dungeon',
  FRIENDLY: 'Friendly',
  BOSS_RAID: 'Boss',
};

export function BattleHistory() {
  const [history, setHistory] = useState<BattleHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>('ALL');

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/battles/history');
        const json = await res.json();
        if (json.success) setHistory(json.data);
      } catch { /* ignore */ }
      finally { setIsLoading(false); }
    }
    void load();
  }, []);

  const filtered = filter === 'ALL' ? history : history.filter((b) => b.type === filter);

  const stats = {
    total: history.length,
    wins: history.filter((b) => b.result === 'WIN').length,
    losses: history.filter((b) => b.result === 'LOSS').length,
    draws: history.filter((b) => b.result === 'DRAW').length,
  };

  return (
    <div className="container max-w-2xl py-8">
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link href="/s/battles"><ArrowLeft className="mr-1 h-4 w-4" /> Battle Arena</Link>
      </Button>

      <h1 className="mb-2 text-2xl font-bold">Battle History</h1>

      {/* Stats summary */}
      <div className="mb-6 grid grid-cols-4 gap-2">
        <div className="rounded-lg border p-2 text-center">
          <p className="text-lg font-bold">{stats.total}</p>
          <p className="text-[10px] text-muted-foreground">Total</p>
        </div>
        <div className="rounded-lg border bg-green-500/5 p-2 text-center">
          <p className="text-lg font-bold text-green-500">{stats.wins}</p>
          <p className="text-[10px] text-muted-foreground">Wins</p>
        </div>
        <div className="rounded-lg border bg-red-500/5 p-2 text-center">
          <p className="text-lg font-bold text-red-500">{stats.losses}</p>
          <p className="text-[10px] text-muted-foreground">Losses</p>
        </div>
        <div className="rounded-lg border bg-gray-500/5 p-2 text-center">
          <p className="text-lg font-bold text-gray-500">{stats.draws}</p>
          <p className="text-[10px] text-muted-foreground">Draws</p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap gap-1">
        {['ALL', 'PVP', 'PVE_DUNGEON', 'FRIENDLY'].map((f) => (
          <Button
            key={f}
            variant={filter === f ? 'default' : 'ghost'}
            size="sm"
            className="text-xs"
            onClick={() => setFilter(f)}
          >
            {f === 'ALL' ? 'All' : typeLabels[f] ?? f}
          </Button>
        ))}
      </div>

      {/* History list */}
      {isLoading ? (
        <div className="py-8 text-center">
          <Loader2 className="mx-auto h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-6 text-center text-sm text-muted-foreground">
            No battles found
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filtered.map((battle) => {
            const rc = resultConfig[battle.result] ?? resultConfig.DRAW;
            return (
              <Card key={battle.id} className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`rounded-lg p-1.5 ${rc.bg}`}>{rc.icon}</span>
                    <div>
                      <p className={`text-sm font-semibold ${rc.color}`}>{rc.label}</p>
                      <div className="flex items-center gap-1.5">
                        <Badge variant="outline" className="text-[10px]">
                          {typeLabels[battle.type] ?? battle.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex gap-2 text-xs">
                      <span className="text-primary">+{battle.xpEarned} XP</span>
                      <span className="text-amber-500">+{battle.kpEarned} KP</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      {new Date(battle.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
