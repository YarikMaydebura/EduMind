'use client';

import { Flame, GraduationCap, Star, Trophy, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { ActivityFeed } from '@/components/gamification/activity-feed';
import { GradeDisplay } from '@/components/gamification/grade-display';
import { LevelBadge } from '@/components/gamification/level-badge';
import { LevelProgress } from '@/components/gamification/level-progress';
import { XPDisplay } from '@/components/gamification/xp-display';
import { MotionPage } from '@/components/motion/motion-page';
import { MotionItem, MotionList } from '@/components/motion/motion-list';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface GradeBreakdown {
  score: number;
  breakdown: { levelScore: number; homeworkScore: number; quizScore: number };
  nextGrade: string | null;
  pointsToNext: number;
}

interface XPData {
  totalXp: number;
  overallLevel: number;
  title: string;
  currentGrade: string;
  streakDays: number;
  longestStreak: number;
  globalGradeScore: number;
  levelProgress: {
    current: number;
    needed: number;
    progress: number;
  };
  classProfiles: Array<{
    classId: string;
    className: string;
    subject: string;
    classXp: number;
    classLevel: number;
    classGrade: string;
    lessonsCompleted: number;
    homeworkCompleted: number;
    quizzesCompleted: number;
    gradeBreakdown: GradeBreakdown;
  }>;
  achievementsSummary: {
    unlocked: number;
    total: number;
  };
}

interface ActivityItem {
  id: string;
  type: string;
  title: string;
  description: string | null;
  xpGained: number | null;
  createdAt: string;
}

export function StudentDashboard() {
  const [xpData, setXpData] = useState<XPData | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [xpRes, actRes] = await Promise.all([
          fetch('/api/students/me/xp'),
          fetch('/api/students/me/activity?limit=10'),
        ]);
        const [xpJson, actJson] = await Promise.all([xpRes.json(), actRes.json()]);
        if (xpJson.success) setXpData(xpJson.data);
        if (actJson.success) setActivities(actJson.data);
      } catch {
        toast.error('Failed to load dashboard');
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  if (isLoading || !xpData) {
    return (
      <div className="container py-8">
        <p className="text-center text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <MotionPage className="container py-8">
      <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>

      {/* Top row: Level + Progress */}
      <Card className="mb-6">
        <CardContent className="flex items-center gap-6 py-6">
          <LevelBadge level={xpData.overallLevel} title={xpData.title} size="lg" />
          <div className="flex-1">
            <LevelProgress
              level={xpData.overallLevel}
              currentXP={xpData.levelProgress.current}
              neededXP={xpData.levelProgress.needed}
              progress={xpData.levelProgress.progress}
            />
          </div>
          <XPDisplay xp={xpData.totalXp} className="text-lg" />
        </CardContent>
      </Card>

      {/* Stats grid */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <p className="text-sm text-muted-foreground">Total XP</p>
            </div>
            <p className="mt-1 text-2xl font-bold">{xpData.totalXp.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              <p className="text-sm text-muted-foreground">Level</p>
            </div>
            <p className="mt-1 text-2xl font-bold">{xpData.overallLevel}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-green-500" />
              <p className="text-sm text-muted-foreground">Grade</p>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <GradeDisplay grade={xpData.currentGrade} size="sm" />
              <span className="text-sm text-muted-foreground">
                {xpData.globalGradeScore} pts
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Flame className="h-4 w-4 text-orange-500" />
              <p className="text-sm text-muted-foreground">Streak</p>
            </div>
            <p className="mt-1 text-2xl font-bold">
              {xpData.streakDays} {xpData.streakDays === 1 ? 'day' : 'days'}
            </p>
            {xpData.longestStreak > 0 && (
              <p className="mt-0.5 text-xs text-muted-foreground">
                Best: {xpData.longestStreak} days
              </p>
            )}
          </CardContent>
        </Card>
        <Link href="/s/achievements">
          <Card className="h-full transition-colors hover:border-primary/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-purple-500" />
                <p className="text-sm text-muted-foreground">Achievements</p>
              </div>
              <p className="mt-1 text-2xl font-bold">
                {xpData.achievementsSummary.unlocked}/{xpData.achievementsSummary.total}
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Two columns: Activity + Class Performance */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ActivityFeed activities={activities} />
          </CardContent>
        </Card>

        {/* Class Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Class Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            {xpData.classProfiles.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No classes enrolled yet
              </p>
            ) : (
              <div className="space-y-4">
                {xpData.classProfiles.map((cp) => (
                  <div key={cp.classId} className="rounded-lg border p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{cp.className}</p>
                        <p className="text-xs text-muted-foreground">
                          {cp.subject.replace(/_/g, ' ')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">Lv.{cp.classLevel}</Badge>
                        <GradeDisplay
                          grade={cp.classGrade}
                          score={cp.gradeBreakdown.score}
                          size="sm"
                        />
                      </div>
                    </div>
                    <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
                      <span>{cp.lessonsCompleted} lessons</span>
                      <span>{cp.homeworkCompleted} homework</span>
                      <span>{cp.quizzesCompleted} quizzes</span>
                      <span className="ml-auto text-yellow-600">{cp.classXp} XP</span>
                    </div>
                    {cp.gradeBreakdown.nextGrade && cp.gradeBreakdown.pointsToNext > 0 && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {Math.round(cp.gradeBreakdown.pointsToNext)} pts to{' '}
                        {cp.gradeBreakdown.nextGrade}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MotionPage>
  );
}
