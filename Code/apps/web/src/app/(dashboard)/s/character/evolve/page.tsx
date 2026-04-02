'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Check, Loader2, Lock, Sparkles, Swords, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { ClassAbilities } from '@/components/gamification/class-abilities';
import { StatComparison } from '@/components/gamification/stat-comparison';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RARITY_LABELS, RARITY_COLORS } from '@edumind/shared';
import { STAT_CONFIG, STAT_KEYS } from '@/lib/gamification/stat-config';

interface RequirementCheck {
  key: string;
  label: string;
  required: number;
  current: number;
  met: boolean;
}

interface EvolutionOption {
  targetClass: {
    id: string;
    name: string;
    rarity: string;
    description: string;
    passives: Record<string, number>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    abilities: any[] | null;
  };
  unlockCheck: { unlocked: boolean; requirements: RequirementCheck[] };
  kpCost: number;
  canAfford: boolean;
  statDiff: Record<string, number>;
}

interface EvolutionData {
  currentClass: { id: string; name: string; rarity: string } | null;
  options: EvolutionOption[];
  hasEligibleEvolution: boolean;
}

export default function EvolvePage() {
  const router = useRouter();
  const [data, setData] = useState<EvolutionData | null>(null);
  const [selectedOption, setSelectedOption] = useState<EvolutionOption | null>(null);
  const [step, setStep] = useState<'select' | 'confirm' | 'success'>('select');
  const [isLoading, setIsLoading] = useState(true);
  const [isEvolving, setIsEvolving] = useState(false);
  const [currentStats, setCurrentStats] = useState<Record<string, number>>({});

  useEffect(() => {
    async function load() {
      try {
        const [evoRes, charRes] = await Promise.all([
          fetch('/api/characters/evolution'),
          fetch('/api/characters/me'),
        ]);
        const [evoJson, charJson] = await Promise.all([evoRes.json(), charRes.json()]);
        if (evoJson.success) setData(evoJson.data);
        if (charJson.success && charJson.data) setCurrentStats(charJson.data.stats);
      } catch {
        toast.error('Failed to load evolution data');
      } finally {
        setIsLoading(false);
      }
    }
    void load();
  }, []);

  async function handleEvolve() {
    if (!selectedOption) return;
    setIsEvolving(true);
    try {
      const res = await fetch('/api/characters/evolution', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetClassId: selectedOption.targetClass.id }),
      });
      const json = await res.json();
      if (json.success) {
        setStep('success');
      } else {
        toast.error(json.message || 'Evolution failed');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setIsEvolving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data?.currentClass) {
    return (
      <div className="container max-w-lg py-16 text-center">
        <Swords className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
        <h2 className="text-xl font-bold">No Character</h2>
        <p className="mt-2 text-muted-foreground">You need to awaken first.</p>
        <Button asChild className="mt-4">
          <a href="/s/awakening">Begin Awakening</a>
        </Button>
      </div>
    );
  }

  if (data.options.length === 0) {
    return (
      <div className="container max-w-lg py-16 text-center">
        <Sparkles className="mx-auto mb-4 h-12 w-12 text-amber-500" />
        <h2 className="text-xl font-bold">Max Evolution</h2>
        <p className="mt-2 text-muted-foreground">
          Your class {data.currentClass.name} has no further evolutions.
        </p>
        <Button variant="outline" asChild className="mt-4">
          <a href="/s/character">Back to Profile</a>
        </Button>
      </div>
    );
  }

  // ─── Success ───
  if (step === 'success' && selectedOption) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="container max-w-lg py-16 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-xl"
        >
          <Sparkles className="h-10 w-10" />
        </motion.div>
        <h1 className="mb-2 text-2xl font-bold">Evolution Complete!</h1>
        <p className="mb-6 text-muted-foreground">
          You are now <span className="font-semibold text-foreground">{selectedOption.targetClass.name}</span>
        </p>
        <Button size="lg" onClick={() => router.push('/s/character')}>
          View Character
        </Button>
      </motion.div>
    );
  }

  // ─── Confirm ───
  if (step === 'confirm' && selectedOption) {
    const colorClass = RARITY_COLORS[selectedOption.targetClass.rarity] ?? '';
    const newStats: Record<string, number> = {};
    for (const key of STAT_KEYS) {
      newStats[key] = (currentStats[key] ?? 0) + (selectedOption.statDiff[key] ?? 0);
    }

    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="container max-w-lg py-8">
        <Button variant="ghost" size="sm" onClick={() => setStep('select')} className="mb-4">
          <ArrowLeft className="mr-1 h-4 w-4" /> Back
        </Button>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Confirm Evolution</CardTitle>
            <p className="text-sm text-muted-foreground">
              {data.currentClass.name} → {selectedOption.targetClass.name}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              <Badge variant="outline" className={colorClass}>
                {RARITY_LABELS[selectedOption.targetClass.rarity]}
              </Badge>
            </div>

            <StatComparison currentStats={currentStats} newStats={newStats} />

            <div className="rounded-lg border bg-muted/30 p-3 text-center text-sm">
              <span className="text-muted-foreground">Cost: </span>
              <span className="font-bold">{selectedOption.kpCost} KP</span>
            </div>

            <Button className="w-full" size="lg" onClick={handleEvolve} disabled={isEvolving}>
              {isEvolving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4" />}
              Evolve!
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // ─── Select ───
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="container max-w-2xl py-8">
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <a href="/s/character"><ArrowLeft className="mr-1 h-4 w-4" /> Character</a>
      </Button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold">Class Evolution</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Current class: <span className="font-semibold">{data.currentClass.name}</span>
          {' '}({RARITY_LABELS[data.currentClass.rarity]})
        </p>
      </div>

      <div className="space-y-4">
        {data.options.map((option) => {
          const colorClass = RARITY_COLORS[option.targetClass.rarity] ?? '';
          const eligible = option.unlockCheck.unlocked && option.canAfford;

          return (
            <Card
              key={option.targetClass.id}
              className={`transition-all ${eligible ? 'cursor-pointer hover:shadow-md hover:border-primary/30' : 'opacity-60'}`}
              onClick={eligible ? () => { setSelectedOption(option); setStep('confirm'); } : undefined}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{option.targetClass.name}</CardTitle>
                    <p className="text-xs text-muted-foreground">{option.targetClass.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={`text-xs ${colorClass}`}>
                      {RARITY_LABELS[option.targetClass.rarity]}
                    </Badge>
                    {eligible ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Lock className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Passives */}
                <div className="flex flex-wrap gap-1">
                  {Object.entries(option.targetClass.passives).map(([stat, val]) => (
                    <Badge key={stat} variant="secondary" className="text-xs">
                      +{Math.round(val * 100)}% {STAT_CONFIG[stat]?.label ?? stat}
                    </Badge>
                  ))}
                </div>

                {/* Stat diff preview */}
                <div className="flex flex-wrap gap-2">
                  {Object.entries(option.statDiff).map(([stat, val]) => (
                    <span key={stat} className={`text-xs font-medium ${(val as number) > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {(val as number) > 0 ? '+' : ''}{val as number} {stat}
                    </span>
                  ))}
                </div>

                {/* KP cost */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Cost: {option.kpCost} KP</span>
                  {!option.canAfford && <span className="text-red-500">Not enough KP</span>}
                </div>

                {/* Requirements */}
                {!option.unlockCheck.unlocked && (
                  <div className="space-y-1">
                    {option.unlockCheck.requirements
                      .filter((r) => !r.met)
                      .map((req) => (
                        <div key={req.key} className="text-xs">
                          <div className="flex items-center justify-between text-muted-foreground">
                            <span>{req.label}</span>
                            <span>{req.current}/{req.required}</span>
                          </div>
                          <Progress value={(req.current / req.required) * 100} className="h-1" />
                        </div>
                      ))}
                  </div>
                )}

                {eligible && (
                  <Button size="sm" className="w-full">
                    <Zap className="mr-1 h-3.5 w-3.5" /> Evolve ({option.kpCost} KP)
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </motion.div>
  );
}
