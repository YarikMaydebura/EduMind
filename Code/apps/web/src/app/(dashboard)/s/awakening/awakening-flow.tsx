'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Check, Loader2, Sparkles, Swords, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { THEME_CONFIG, THEME_KEYS } from '@/lib/gamification/theme-config';
import { STAT_CONFIG, STAT_KEYS } from '@/lib/gamification/stat-config';

interface ProposedClass {
  id: string;
  name: string;
  description: string;
  passives: Record<string, number>;
  matchScore: number;
  matchReason: string;
}

export function AwakeningFlow({ studentName }: { studentName: string }) {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedTheme, setSelectedTheme] = useState('');
  const [proposedClasses, setProposedClasses] = useState<ProposedClass[]>([]);
  const [selectedClass, setSelectedClass] = useState<ProposedClass | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [createdCharacter, setCreatedCharacter] = useState<Record<string, unknown> | null>(null);

  async function handleThemeSelect(theme: string) {
    setSelectedTheme(theme);
    setIsLoading(true);
    try {
      const res = await fetch(`/api/characters/propose?theme=${theme}`);
      const json = await res.json();
      if (json.success) {
        setProposedClasses(json.data as ProposedClass[]);
        setStep(2);
      } else {
        toast.error('Failed to load classes');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAwaken() {
    if (!selectedClass) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/characters/awaken', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme: selectedTheme, classId: selectedClass.id }),
      });
      const json = await res.json();
      if (json.success) {
        setCreatedCharacter(json.data);
        setStep(4);
      } else {
        toast.error(json.message || 'Awakening failed');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }

  const maxScore = Math.max(...proposedClasses.map((c) => c.matchScore), 1);
  const themeInfo = THEME_CONFIG[selectedTheme];

  return (
    <div className="container max-w-4xl py-8">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between text-sm text-muted-foreground">
          <span>Step {step} of 4</span>
          <span>{step === 1 ? 'Choose Theme' : step === 2 ? 'Select Class' : step === 3 ? 'Confirm' : 'Awakened!'}</span>
        </div>
        <Progress value={(step / 4) * 100} className="h-2" />
      </div>

      {/* ─── Step 1: Theme Selection ─── */}
      {step === 1 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-6 text-center">
            <Sparkles className="mx-auto mb-3 h-10 w-10 text-purple-500" />
            <h1 className="text-2xl font-bold">Character Awakening</h1>
            <p className="mt-2 text-muted-foreground">
              Congratulations {studentName}! You&apos;ve reached Level 5. Choose your battle theme.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {THEME_KEYS.map((key, i) => {
              const theme = THEME_CONFIG[key];
              if (!theme) return null;
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Card
                    className="cursor-pointer transition-all hover:shadow-lg hover:border-primary/40"
                    onClick={() => !isLoading && handleThemeSelect(key)}
                  >
                    <CardHeader className="pb-2">
                      <div className={`mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${theme.bgClass} text-white text-xl`}>
                        {theme.emoji}
                      </div>
                      <CardTitle className="text-lg">{theme.label}</CardTitle>
                      <CardDescription>{theme.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {isLoading && (
            <div className="mt-6 flex items-center justify-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Loading classes...</span>
            </div>
          )}
        </motion.div>
      )}

      {/* ─── Step 2: Class Selection ─── */}
      {step === 2 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-6">
            <Button variant="ghost" size="sm" onClick={() => { setStep(1); setSelectedClass(null); }}>
              <ArrowLeft className="mr-1 h-4 w-4" /> Back
            </Button>
          </div>

          <div className="mb-6 text-center">
            <h2 className="text-xl font-bold">
              Choose Your {themeInfo?.label} Class
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Classes are ranked by how well they match your academic strengths
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {proposedClasses.map((cls, i) => (
              <motion.div
                key={cls.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedClass?.id === cls.id ? 'border-primary ring-2 ring-primary/20' : ''
                  }`}
                  onClick={() => setSelectedClass(cls)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base">{cls.name}</CardTitle>
                      {selectedClass?.id === cls.id && (
                        <Check className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <CardDescription>{cls.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <div className="mb-1 flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Match</span>
                        <span className="font-medium">
                          {Math.round((cls.matchScore / maxScore) * 100)}%
                        </span>
                      </div>
                      <Progress value={(cls.matchScore / maxScore) * 100} className="h-1.5" />
                    </div>
                    <p className="text-xs text-muted-foreground">{cls.matchReason}</p>
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(cls.passives).map(([stat, val]) => (
                        <Badge key={stat} variant="secondary" className="text-xs">
                          +{Math.round(val * 100)}% {stat}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {selectedClass && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6"
            >
              <Button className="w-full" size="lg" onClick={() => setStep(3)}>
                Continue with {selectedClass.name}
              </Button>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* ─── Step 3: Confirmation ─── */}
      {step === 3 && selectedClass && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-6">
            <Button variant="ghost" size="sm" onClick={() => setStep(2)}>
              <ArrowLeft className="mr-1 h-4 w-4" /> Back
            </Button>
          </div>

          <Card className="mx-auto max-w-lg">
            <CardHeader className="text-center">
              <div className={`mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${themeInfo?.bgClass ?? 'from-gray-500 to-gray-600'} text-white text-2xl`}>
                {themeInfo?.emoji}
              </div>
              <CardTitle className="text-xl">{selectedClass.name}</CardTitle>
              <CardDescription>{selectedClass.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center gap-2">
                <Badge>{themeInfo?.label}</Badge>
                <Badge variant="outline">Common</Badge>
              </div>
              <div className="flex flex-wrap justify-center gap-1">
                {Object.entries(selectedClass.passives).map(([stat, val]) => (
                  <Badge key={stat} variant="secondary">
                    +{Math.round(val * 100)}% {STAT_CONFIG[stat]?.label ?? stat}
                  </Badge>
                ))}
              </div>
              <div className="rounded-lg border bg-muted/30 p-3 text-center text-sm text-muted-foreground">
                Your stats will be calculated from your academic performance across all enrolled subjects.
              </div>
              <Button
                className="w-full"
                size="lg"
                onClick={handleAwaken}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Zap className="mr-2 h-4 w-4" />
                )}
                Awaken!
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* ─── Step 4: Celebration ─── */}
      {step === 4 && selectedClass && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', duration: 0.8 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2, stiffness: 200 }}
            className={`mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br ${themeInfo?.bgClass ?? 'from-gray-500 to-gray-600'} text-white shadow-xl`}
          >
            <Swords className="h-12 w-12" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-2 text-3xl font-bold"
          >
            Character Awakened!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mb-8 text-lg text-muted-foreground"
          >
            You are now <span className="font-semibold text-foreground">{selectedClass.name}</span>
          </motion.p>

          {/* Animated stat bars */}
          {createdCharacter && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mx-auto mb-8 max-w-sm space-y-2"
            >
              {STAT_KEYS.map((key, i) => {
                const value = (createdCharacter as Record<string, number>)[key.toLowerCase()] ??
                  (createdCharacter as Record<string, number>)[`max${key.charAt(0)}${key.slice(1).toLowerCase()}`] ?? 0;
                const config = STAT_CONFIG[key];
                if (!config) return null;
                return (
                  <div key={key} className="flex items-center gap-3">
                    <span className="w-16 text-right text-xs font-medium text-muted-foreground">
                      {config.label}
                    </span>
                    <div className="relative h-3 flex-1 overflow-hidden rounded-full bg-muted">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (value / config.max) * 100)}%` }}
                        transition={{ delay: 1 + i * 0.1, duration: 0.6 }}
                        className={`absolute inset-y-0 left-0 rounded-full ${config.barClass}`}
                      />
                    </div>
                    <span className="w-10 text-xs font-bold">{value}</span>
                  </div>
                );
              })}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
          >
            <Button size="lg" onClick={() => router.push('/s/character')}>
              <Swords className="mr-2 h-4 w-4" />
              View Character Profile
            </Button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
