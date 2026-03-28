'use client';

import { Trophy } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import {
  AchievementCard,
  type AchievementCardData,
} from '@/components/gamification/achievement-card';
import { MotionPage } from '@/components/motion/motion-page';
import { MotionItem, MotionList } from '@/components/motion/motion-list';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const CATEGORY_LABELS: Record<string, string> = {
  all: 'All',
  streak: 'Streaks',
  level: 'Levels',
  grade: 'Grades',
  homework: 'Homework',
  quiz: 'Quizzes',
  skill: 'Skills',
  social: 'Social',
};

interface AchievementsData {
  achievements: AchievementCardData[];
  summary: { unlocked: number; total: number; percentage: number };
  categories: string[];
}

export function StudentAchievements() {
  const [data, setData] = useState<AchievementsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/students/me/achievements');
        const json = await res.json();
        if (json.success) setData(json.data);
      } catch {
        toast.error('Failed to load achievements');
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  if (isLoading || !data) {
    return (
      <div className="container py-8">
        <p className="text-center text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const filteredAchievements =
    selectedCategory === 'all'
      ? data.achievements
      : data.achievements.filter((a) => a.category === selectedCategory);

  // Sort: unlocked first, then by progress percentage desc
  const sortedAchievements = [...filteredAchievements].sort((a, b) => {
    if (a.isUnlocked !== b.isUnlocked) return a.isUnlocked ? -1 : 1;
    const aProgress = a.progressMax > 0 ? a.progress / a.progressMax : 0;
    const bProgress = b.progressMax > 0 ? b.progress / b.progressMax : 0;
    return bProgress - aProgress;
  });

  return (
    <MotionPage className="container py-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Achievements</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track your progress and unlock rewards
          </p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <span className="text-2xl font-bold">
              {data.summary.unlocked}/{data.summary.total}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">{data.summary.percentage}% complete</p>
        </div>
      </div>

      {/* Overall progress bar */}
      <div className="mb-6">
        <Progress value={data.summary.percentage} max={100} />
      </div>

      {/* Category filter tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {data.categories.map((cat) => {
          const count =
            cat === 'all'
              ? data.achievements.length
              : data.achievements.filter((a) => a.category === cat).length;
          if (count === 0 && cat !== 'all') return null;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {CATEGORY_LABELS[cat] ?? cat}
              <Badge
                variant={selectedCategory === cat ? 'secondary' : 'outline'}
                className="ml-0.5 h-5 px-1.5 text-xs"
              >
                {count}
              </Badge>
            </button>
          );
        })}
      </div>

      {/* Achievements grid */}
      {sortedAchievements.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">
          No achievements in this category yet.
        </p>
      ) : (
        <MotionList className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sortedAchievements.map((achievement) => (
            <MotionItem key={achievement.id}>
              <AchievementCard achievement={achievement} />
            </MotionItem>
          ))}
        </MotionList>
      )}
    </MotionPage>
  );
}
