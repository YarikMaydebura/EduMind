'use client';

import { Crown, Medal, Trophy, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { MotionPage } from '@/components/motion/motion-page';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface LeaderboardEntry {
  rank: number;
  studentId: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
  title: string | null;
  totalXp: number;
  level: number;
  grade: string;
  streakDays: number;
  isCurrentUser: boolean;
}

interface ClassOption {
  classId: string;
  className: string;
  subject: string;
}

export function StudentLeaderboard() {
  const [scope, setScope] = useState<'global' | 'class'>('global');
  const [selectedClassId, setSelectedClassId] = useState('');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [currentUserRank, setCurrentUserRank] = useState<LeaderboardEntry | null>(null);
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load enrolled classes for class scope selector
  useEffect(() => {
    async function loadClasses() {
      try {
        const res = await fetch('/api/students/me/xp');
        const json = await res.json();
        if (json.success && json.data.classProfiles) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const opts = json.data.classProfiles.map((cp: any) => ({
            classId: cp.classId,
            className: cp.className,
            subject: cp.subject,
          }));
          setClasses(opts);
          if (opts.length > 0) setSelectedClassId(opts[0].classId);
        }
      } catch {
        // silent
      }
    }
    loadClasses();
  }, []);

  // Load leaderboard data
  useEffect(() => {
    async function loadLeaderboard() {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({ scope, limit: '20' });
        if (scope === 'class' && selectedClassId) {
          params.set('classId', selectedClassId);
        }
        const res = await fetch(`/api/students/leaderboard?${params}`);
        const json = await res.json();
        if (json.success) {
          setLeaderboard(json.data.leaderboard);
          setCurrentUserRank(json.data.currentUserRank);
        }
      } catch {
        toast.error('Failed to load leaderboard');
      } finally {
        setIsLoading(false);
      }
    }

    if (scope === 'global' || (scope === 'class' && selectedClassId)) {
      loadLeaderboard();
    }
  }, [scope, selectedClassId]);

  function getRankDisplay(rank: number) {
    if (rank === 1) return <Crown className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-amber-700" />;
    return (
      <span className="w-5 text-center text-sm font-medium text-muted-foreground">
        {rank}
      </span>
    );
  }

  function renderEntry(entry: LeaderboardEntry) {
    return (
      <div
        key={entry.studentId}
        className={cn(
          'flex items-center gap-4 rounded-lg border p-3',
          entry.isCurrentUser && 'border-primary bg-primary/5',
        )}
      >
        <div className="flex w-8 items-center justify-center">
          {getRankDisplay(entry.rank)}
        </div>
        <Avatar className="h-9 w-9">
          <AvatarImage src={entry.avatar ?? undefined} />
          <AvatarFallback>
            {entry.firstName[0]}
            {entry.lastName[0]}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">
            {entry.firstName} {entry.lastName}
            {entry.isCurrentUser && (
              <span className="ml-1 text-xs text-muted-foreground">(you)</span>
            )}
          </p>
          {entry.title && (
            <p className="text-xs text-muted-foreground">{entry.title}</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary">Lv.{entry.level}</Badge>
          <Badge variant="outline">{entry.grade}</Badge>
          <span className="min-w-[60px] text-right text-sm font-semibold text-yellow-600">
            {entry.totalXp.toLocaleString()} XP
          </span>
        </div>
      </div>
    );
  }

  return (
    <MotionPage className="container py-8">
      <h1 className="mb-6 text-3xl font-bold">Leaderboard</h1>

      {/* Scope selector */}
      <div className="mb-6 flex items-center gap-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setScope('global')}
            className={cn(
              'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
              scope === 'global'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:text-foreground',
            )}
          >
            <Users className="h-4 w-4" />
            School
          </button>
          <button
            type="button"
            onClick={() => setScope('class')}
            className={cn(
              'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
              scope === 'class'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:text-foreground',
            )}
          >
            <Trophy className="h-4 w-4" />
            Class
          </button>
        </div>

        {scope === 'class' && classes.length > 0 && (
          <Select value={selectedClassId} onValueChange={setSelectedClassId}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select class" />
            </SelectTrigger>
            <SelectContent>
              {classes.map((c) => (
                <SelectItem key={c.classId} value={c.classId}>
                  {c.className}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Leaderboard list */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Top Students
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="py-8 text-center text-muted-foreground">Loading...</p>
          ) : leaderboard.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">
              No leaderboard data yet
            </p>
          ) : (
            <div className="space-y-2">
              {leaderboard.map(renderEntry)}

              {currentUserRank && (
                <>
                  <div className="flex items-center gap-2 py-2">
                    <div className="h-px flex-1 bg-border" />
                    <span className="text-xs text-muted-foreground">Your rank</span>
                    <div className="h-px flex-1 bg-border" />
                  </div>
                  {renderEntry(currentUserRank)}
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </MotionPage>
  );
}
