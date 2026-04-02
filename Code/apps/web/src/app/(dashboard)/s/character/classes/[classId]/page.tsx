'use client';

import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { ClassAbilities } from '@/components/gamification/class-abilities';
import { StatComparison } from '@/components/gamification/stat-comparison';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RARITY_LABELS, RARITY_COLORS } from '@edumind/shared';

interface RequirementCheck {
  key: string;
  label: string;
  required: number;
  current: number;
  met: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface ClassDetail {
  id: string;
  name: string;
  theme: string;
  rarity: string;
  description: string;
  passives: Record<string, number>;
  abilities: Array<{ name: string; description: string; type: string; icon: string; effects: string }> | null;
  evolvesFrom: { id: string; name: string; rarity: string } | null;
  evolvesTo: Array<{ id: string; name: string; rarity: string }>;
  unlockCheck: { unlocked: boolean; requirements: RequirementCheck[] };
  statPreview: { base: Record<string, number>; withClass: Record<string, number>; diff: Record<string, number> };
}

export default function ClassDetailPage() {
  const { classId } = useParams();
  const [data, setData] = useState<ClassDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/characters/classes/${classId}`);
        const json = await res.json();
        if (json.success) setData(json.data);
      } catch {
        // ignore
      } finally {
        setIsLoading(false);
      }
    }
    void load();
  }, [classId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data) {
    return <p className="py-16 text-center text-muted-foreground">Class not found</p>;
  }

  const colorClass = RARITY_COLORS[data.rarity] ?? '';
  const label = RARITY_LABELS[data.rarity] ?? '';

  return (
    <div className="container max-w-2xl py-8">
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link href="/s/character/classes">
          <ArrowLeft className="mr-1 h-4 w-4" /> All Classes
        </Link>
      </Button>

      {/* Header */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{data.name}</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">{data.description}</p>
            </div>
            <Badge variant="outline" className={`text-sm ${colorClass}`}>
              {label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {Object.entries(data.passives).map(([stat, val]) => (
              <Badge key={stat} variant="secondary">
                +{Math.round(val * 100)}% {stat}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Requirements */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">
            Unlock Requirements
            {data.unlockCheck.unlocked ? (
              <Badge className="ml-2" variant="default">Unlocked</Badge>
            ) : (
              <Badge className="ml-2" variant="destructive">Locked</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.unlockCheck.requirements.map((req) => (
            <div key={req.key}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className={req.met ? 'text-green-500' : 'text-muted-foreground'}>
                  {req.met ? '✓' : '○'} {req.label}
                </span>
                <span className="font-medium">
                  {req.current} / {req.required}
                </span>
              </div>
              <Progress
                value={Math.min(100, (req.current / req.required) * 100)}
                className="h-1.5"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Stat Preview */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Stat Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <StatComparison
            currentStats={data.statPreview.base}
            newStats={data.statPreview.withClass}
          />
        </CardContent>
      </Card>

      {/* Abilities */}
      {data.abilities && data.abilities.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">Abilities</CardTitle>
          </CardHeader>
          <CardContent>
            <ClassAbilities abilities={data.abilities as Array<{ name: string; description: string; type: 'passive' | 'active'; icon: string; effects: string }>} />
          </CardContent>
        </Card>
      )}

      {/* Evolution */}
      {(data.evolvesFrom || data.evolvesTo.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Evolution Path</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.evolvesFrom && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Evolves from:</span>
                <Link
                  href={`/s/character/classes/${data.evolvesFrom.id}`}
                  className="font-medium text-primary hover:underline"
                >
                  {data.evolvesFrom.name}
                </Link>
                <Badge variant="outline" className={`text-xs ${RARITY_COLORS[data.evolvesFrom.rarity] ?? ''}`}>
                  {RARITY_LABELS[data.evolvesFrom.rarity]}
                </Badge>
              </div>
            )}
            {data.evolvesTo.length > 0 && (
              <div className="space-y-1">
                <span className="text-sm text-muted-foreground">Evolves to:</span>
                {data.evolvesTo.map((child) => (
                  <div key={child.id} className="flex items-center gap-2 pl-4">
                    <Link
                      href={`/s/character/classes/${child.id}`}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      {child.name}
                    </Link>
                    <Badge variant="outline" className={`text-xs ${RARITY_COLORS[child.rarity] ?? ''}`}>
                      {RARITY_LABELS[child.rarity]}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
