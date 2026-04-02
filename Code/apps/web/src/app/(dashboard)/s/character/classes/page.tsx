'use client';

import { Loader2, Swords } from 'lucide-react';
import { useEffect, useState } from 'react';

import { ClassCard } from '@/components/gamification/class-card';
import { MotionPage } from '@/components/motion/motion-page';
import { RARITY_LABELS, RARITY_ORDER } from '@edumind/shared';

interface ClassData {
  id: string;
  name: string;
  rarity: string;
  description: string;
  passives: Record<string, number>;
  isEquipped: boolean;
  rarityOrder: number;
}

export default function ClassBrowserPage() {
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        // First get character to know the theme
        const charRes = await fetch('/api/characters/me');
        const charJson = await charRes.json();

        if (!charJson.awakened || !charJson.data) return;

        const theme = charJson.data.theme;
        const res = await fetch(`/api/characters/classes?theme=${theme}`);
        const json = await res.json();
        if (json.success) {
          setClasses(json.data.classes);
        }
      } catch {
        // ignore
      } finally {
        setIsLoading(false);
      }
    }
    void load();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Group by rarity
  const grouped: Record<string, ClassData[]> = {};
  for (const c of classes) {
    if (!grouped[c.rarity]) grouped[c.rarity] = [];
    grouped[c.rarity]!.push(c);
  }

  return (
    <MotionPage className="container max-w-4xl py-8">
      <div className="mb-6">
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <Swords className="h-6 w-6" /> Character Classes
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Browse all classes in your theme. Evolve your character to unlock higher rarities.
        </p>
      </div>

      {RARITY_ORDER.map((rarity) => {
        const group = grouped[rarity];
        if (!group || group.length === 0) return null;

        return (
          <div key={rarity} className="mb-8">
            <h2 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              {RARITY_LABELS[rarity] ?? rarity} ({group.length})
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {group.map((c) => (
                <ClassCard
                  key={c.id}
                  name={c.name}
                  rarity={c.rarity}
                  description={c.description}
                  passives={c.passives as Record<string, number>}
                  isEquipped={c.isEquipped}
                  onClick={() => {
                    window.location.href = `/s/character/classes/${c.id}`;
                  }}
                />
              ))}
            </div>
          </div>
        );
      })}
    </MotionPage>
  );
}
