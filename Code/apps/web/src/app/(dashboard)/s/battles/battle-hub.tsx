'use client';

import { motion } from 'framer-motion';
import { Flame, Loader2, Shield, Swords, Trophy } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface BattleHistoryItem {
  id: string;
  type: string;
  result: 'WIN' | 'LOSS' | 'DRAW' | 'FORFEIT';
  xpEarned: number;
  kpEarned: number;
  date: string;
}

export function BattleHub() {
  const router = useRouter();
  const [history, setHistory] = useState<BattleHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isStarting, setIsStarting] = useState<string | null>(null);

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

  async function startBattle(type: 'PVE_DUNGEON' | 'FRIENDLY') {
    setIsStarting(type);
    try {
      const res = await fetch('/api/battles/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      });
      const json = await res.json();
      if (json.success) {
        router.push(`/s/battles/${json.data.battleId}`);
      } else {
        toast.error(json.message || 'Failed to start battle');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setIsStarting(null);
    }
  }

  const resultConfig = {
    WIN: { color: 'text-green-500', bg: 'bg-green-500/10', icon: '🏆' },
    LOSS: { color: 'text-red-500', bg: 'bg-red-500/10', icon: '💀' },
    DRAW: { color: 'text-gray-500', bg: 'bg-gray-500/10', icon: '⚖️' },
    FORFEIT: { color: 'text-orange-500', bg: 'bg-orange-500/10', icon: '🏳️' },
  };

  return (
    <div className="container max-w-2xl py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <Flame className="h-7 w-7 text-orange-500" />
          Battle Arena
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Test your strength against AI opponents. Earn XP and Knowledge Points!
        </p>
      </div>

      {/* Battle mode cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="transition-all hover:shadow-md hover:border-primary/30">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-orange-600 text-white">
                  <Swords className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-base">PvE Dungeon</CardTitle>
                  <CardDescription className="text-xs">Fight AI opponents</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Badge variant="secondary" className="text-xs">+50 XP</Badge>
                <Badge variant="secondary" className="text-xs">+50 KP</Badge>
                <Badge variant="outline" className="text-xs">10/day</Badge>
              </div>
              <Button
                className="w-full"
                onClick={() => startBattle('PVE_DUNGEON')}
                disabled={!!isStarting}
              >
                {isStarting === 'PVE_DUNGEON' ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Swords className="mr-2 h-4 w-4" />
                )}
                Start Dungeon
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="transition-all hover:shadow-md hover:border-primary/30">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 text-white">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-base">Friendly Practice</CardTitle>
                  <CardDescription className="text-xs">Low-stakes training</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Badge variant="secondary" className="text-xs">+25 XP</Badge>
                <Badge variant="secondary" className="text-xs">+25 KP</Badge>
                <Badge variant="outline" className="text-xs">Unlimited</Badge>
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => startBattle('FRIENDLY')}
                disabled={!!isStarting}
              >
                {isStarting === 'FRIENDLY' ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Shield className="mr-2 h-4 w-4" />
                )}
                Start Practice
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent history */}
      <div className="mt-8">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
          <Trophy className="h-4 w-4" />
          Recent Battles
        </h2>

        {isLoading ? (
          <div className="py-4 text-center">
            <Loader2 className="mx-auto h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : history.length === 0 ? (
          <Card>
            <CardContent className="py-6 text-center text-sm text-muted-foreground">
              No battles yet. Start your first battle above!
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {history.map((battle) => {
              const rc = resultConfig[battle.result] ?? resultConfig.DRAW;
              return (
                <Card key={battle.id} className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`rounded-lg p-1.5 ${rc.bg}`}>
                        {rc.icon}
                      </span>
                      <div>
                        <p className={`text-sm font-semibold ${rc.color}`}>
                          {battle.result}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {battle.type.replace('_', ' ')}
                        </p>
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
    </div>
  );
}
