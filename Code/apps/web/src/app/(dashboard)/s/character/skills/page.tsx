'use client';

import { Loader2, Sparkles, Swords } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import { SkillCard } from '@/components/gamification/skill-card';
import { SkillDetailModal } from '@/components/gamification/skill-detail-modal';
import { MotionPage } from '@/components/motion/motion-page';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MAX_EQUIPPED_SKILLS, SKILL_TYPE_CONFIG } from '@edumind/shared';

interface SkillData {
  characterSkillId?: string;
  id: string;
  name: string;
  type: string;
  rarity: string;
  description: string;
  mpCost: number;
  staCost: number;
  power: number;
  hitCount: number;
  cooldown: number;
  isEquipped?: boolean;
  equipSlot?: number | null;
  masteryLevel?: number;
}

export default function SkillsPage() {
  const [tab, setTab] = useState<'my' | 'all'>('my');
  const [mySkills, setMySkills] = useState<{ equipped: SkillData[]; unequipped: SkillData[]; totalLearned: number; totalEquipped: number } | null>(null);
  const [allSkills, setAllSkills] = useState<SkillData[]>([]);
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);

  const loadMySkills = useCallback(async () => {
    try {
      const res = await fetch('/api/skills/me');
      const json = await res.json();
      if (json.success) setMySkills(json.data);
    } catch { /* ignore */ }
  }, []);

  const loadAllSkills = useCallback(async () => {
    try {
      const url = typeFilter ? `/api/skills?type=${typeFilter}` : '/api/skills';
      const res = await fetch(url);
      const json = await res.json();
      if (json.success) setAllSkills(json.data);
    } catch { /* ignore */ }
  }, [typeFilter]);

  useEffect(() => {
    async function init() {
      await Promise.all([loadMySkills(), loadAllSkills()]);
      setIsLoading(false);
    }
    void init();
  }, [loadMySkills, loadAllSkills]);

  useEffect(() => {
    if (tab === 'all') void loadAllSkills();
  }, [typeFilter, tab, loadAllSkills]);

  function handleAction() {
    void loadMySkills();
    void loadAllSkills();
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <MotionPage className="container max-w-4xl py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            <Swords className="h-6 w-6" /> Skills
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Learn and equip up to {MAX_EQUIPPED_SKILLS} skills for battle
          </p>
        </div>
        {mySkills && (
          <Badge variant="outline" className="text-sm">
            <Sparkles className="mr-1 h-3.5 w-3.5" />
            {mySkills.totalEquipped}/{MAX_EQUIPPED_SKILLS} equipped
          </Badge>
        )}
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-2">
        <Button
          variant={tab === 'my' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setTab('my')}
        >
          My Skills ({mySkills?.totalLearned ?? 0})
        </Button>
        <Button
          variant={tab === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setTab('all')}
        >
          All Skills ({allSkills.length})
        </Button>
      </div>

      {/* My Skills tab */}
      {tab === 'my' && mySkills && (
        <div className="space-y-6">
          {/* Equipped */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Equipped ({mySkills.totalEquipped}/{MAX_EQUIPPED_SKILLS})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {mySkills.equipped.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  No skills equipped. Learn and equip skills from the All Skills tab.
                </p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {mySkills.equipped.map((s) => (
                    <SkillCard
                      key={s.characterSkillId}
                      {...s}
                      isEquipped
                      isLearned
                      onClick={() => setSelectedSkillId(s.id)}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Unequipped */}
          {mySkills.unequipped.length > 0 && (
            <div>
              <h3 className="mb-3 text-sm font-semibold text-muted-foreground">
                Unequipped ({mySkills.unequipped.length})
              </h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {mySkills.unequipped.map((s) => (
                  <SkillCard
                    key={s.characterSkillId}
                    {...s}
                    isLearned
                    onClick={() => setSelectedSkillId(s.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* All Skills tab */}
      {tab === 'all' && (
        <div>
          {/* Type filters */}
          <div className="mb-4 flex flex-wrap gap-1">
            <Button
              variant={typeFilter === '' ? 'default' : 'ghost'}
              size="sm"
              className="text-xs"
              onClick={() => setTypeFilter('')}
            >
              All
            </Button>
            {Object.entries(SKILL_TYPE_CONFIG).map(([key, config]) => (
              <Button
                key={key}
                variant={typeFilter === key ? 'default' : 'ghost'}
                size="sm"
                className="text-xs"
                onClick={() => setTypeFilter(key)}
              >
                {config.icon} {config.label}
              </Button>
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {allSkills.map((s) => (
              <SkillCard
                key={s.id}
                {...s}
                onClick={() => setSelectedSkillId(s.id)}
              />
            ))}
          </div>

          {allSkills.length === 0 && (
            <p className="py-8 text-center text-muted-foreground">No skills found</p>
          )}
        </div>
      )}

      {/* Skill detail modal */}
      <SkillDetailModal
        skillId={selectedSkillId}
        open={!!selectedSkillId}
        onClose={() => setSelectedSkillId(null)}
        onAction={handleAction}
      />
    </MotionPage>
  );
}
