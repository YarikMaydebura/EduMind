'use client';

import { motion } from 'framer-motion';
import { Loader2, Shield, Sparkles, Swords, Target, Zap } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { ClassAbilities } from '@/components/gamification/class-abilities';
import { StatBar } from '@/components/gamification/stat-bar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { STAT_CONFIG, STAT_KEYS } from '@/lib/gamification/stat-config';
import { THEME_CONFIG } from '@/lib/gamification/theme-config';

interface CharacterData {
  id: string;
  theme: string;
  class: {
    name: string;
    theme: string;
    rarity: string;
    description: string;
    passives: Record<string, number>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    abilities: any[] | null;
  };
  stats: Record<string, number>;
  liveStats: Record<string, number>;
  derivedStats: {
    critChance: number;
    critDamage: number;
    dodgeChance: number;
    damageReduction: number;
  };
  battleRecord: {
    wins: number;
    losses: number;
    draws: number;
    mobsDefeated: number;
    bossesDefeated: number;
  };
  knowledgePoints: number;
}

export function CharacterProfile() {
  const [data, setData] = useState<CharacterData | null>(null);
  const [awakened, setAwakened] = useState<boolean | null>(null);
  const [canAwaken, setCanAwaken] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCharacter() {
      try {
        const res = await fetch('/api/characters/me');
        const json = await res.json();
        setAwakened(json.awakened ?? false);
        setCanAwaken(json.canAwaken ?? false);
        if (json.awakened) {
          setData(json.data as CharacterData);
        }
      } catch {
        // ignore
      } finally {
        setIsLoading(false);
      }
    }
    void fetchCharacter();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!awakened) {
    return (
      <div className="container max-w-lg py-16 text-center">
        <Swords className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
        <h2 className="text-xl font-bold">Battle Character</h2>
        <p className="mt-2 text-muted-foreground">
          {canAwaken
            ? 'Your battle character awaits! Begin the awakening process.'
            : 'Reach Level 5 to unlock your battle character.'}
        </p>
        {canAwaken && (
          <Button asChild className="mt-4">
            <Link href="/s/awakening">
              <Zap className="mr-2 h-4 w-4" />
              Begin Awakening
            </Link>
          </Button>
        )}
      </div>
    );
  }

  if (!data) return null;

  const themeInfo = THEME_CONFIG[data.theme];
  const totalBattles = data.battleRecord.wins + data.battleRecord.losses + data.battleRecord.draws;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container max-w-3xl py-8"
    >
      {/* Header */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${themeInfo?.bgClass ?? 'from-gray-500 to-gray-600'} text-white text-2xl shadow-lg`}>
              {themeInfo?.emoji}
            </div>
            <div className="flex-1">
              <CardTitle className="text-2xl">{data.class.name}</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">{data.class.description}</p>
              <div className="mt-2 flex gap-2">
                <Badge>{themeInfo?.label ?? data.theme}</Badge>
                <Badge variant="outline">{data.class.rarity.replace('CLASS_', '')}</Badge>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Swords className="h-4 w-4" /> Battle Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {STAT_KEYS.map((key, i) => {
              const config = STAT_CONFIG[key];
              if (!config) return null;
              return (
                <StatBar
                  key={key}
                  label={config.label}
                  value={data.stats[key] ?? 0}
                  max={config.max}
                  barClass={config.barClass}
                  delay={i * 0.08}
                />
              );
            })}
          </CardContent>
        </Card>

        {/* Derived Stats + Record */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Target className="h-4 w-4" /> Derived Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border p-3 text-center">
                  <p className="text-xs text-muted-foreground">Crit Chance</p>
                  <p className="text-lg font-bold">{data.derivedStats.critChance.toFixed(1)}%</p>
                </div>
                <div className="rounded-lg border p-3 text-center">
                  <p className="text-xs text-muted-foreground">Crit Damage</p>
                  <p className="text-lg font-bold">{data.derivedStats.critDamage.toFixed(0)}%</p>
                </div>
                <div className="rounded-lg border p-3 text-center">
                  <p className="text-xs text-muted-foreground">Dodge</p>
                  <p className="text-lg font-bold">{data.derivedStats.dodgeChance.toFixed(1)}%</p>
                </div>
                <div className="rounded-lg border p-3 text-center">
                  <p className="text-xs text-muted-foreground">Dmg Reduction</p>
                  <p className="text-lg font-bold">{data.derivedStats.damageReduction.toFixed(1)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Shield className="h-4 w-4" /> Battle Record
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg bg-green-500/10 p-2">
                  <p className="text-lg font-bold text-green-600">{data.battleRecord.wins}</p>
                  <p className="text-xs text-muted-foreground">Wins</p>
                </div>
                <div className="rounded-lg bg-red-500/10 p-2">
                  <p className="text-lg font-bold text-red-600">{data.battleRecord.losses}</p>
                  <p className="text-xs text-muted-foreground">Losses</p>
                </div>
                <div className="rounded-lg bg-gray-500/10 p-2">
                  <p className="text-lg font-bold text-gray-600">{data.battleRecord.draws}</p>
                  <p className="text-xs text-muted-foreground">Draws</p>
                </div>
              </div>
              {totalBattles > 0 && (
                <p className="mt-2 text-center text-xs text-muted-foreground">
                  Win rate: {Math.round((data.battleRecord.wins / totalBattles) * 100)}%
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium">Knowledge Points</span>
              </div>
              <span className="text-lg font-bold">{data.knowledgePoints}</span>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Passives */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Class Passives</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {Object.entries(data.class.passives).map(([stat, val]) => (
              <Badge key={stat} variant="secondary" className="text-sm">
                +{Math.round((val as number) * 100)}% {STAT_CONFIG[stat]?.label ?? stat}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Abilities (Epic+ classes) */}
      {data.class.abilities && (data.class.abilities as unknown[]).length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base">Abilities</CardTitle>
          </CardHeader>
          <CardContent>
            <ClassAbilities abilities={data.class.abilities as Array<{ name: string; description: string; type: 'passive' | 'active'; icon: string; effects: string }>} />
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="mt-6 flex gap-3">
        <Button variant="outline" asChild className="flex-1">
          <Link href="/s/character/classes">Browse Classes</Link>
        </Button>
        <Button asChild className="flex-1">
          <Link href="/s/character/evolve">
            <Zap className="mr-2 h-4 w-4" />
            Evolve
          </Link>
        </Button>
      </div>
    </motion.div>
  );
}
