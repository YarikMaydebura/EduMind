'use client';

import { BookOpen, Brain, FileText, Star, TrendingUp, Trophy } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ActivityItem {
  id: string;
  type: string;
  title: string;
  description: string | null;
  xpGained: number | null;
  createdAt: string;
}

const ICON_MAP: Record<string, typeof BookOpen> = {
  LESSON_COMPLETED: BookOpen,
  HOMEWORK_SUBMITTED: FileText,
  QUIZ_COMPLETED: Brain,
  LEVEL_UP: TrendingUp,
  ACHIEVEMENT_UNLOCKED: Trophy,
  STREAK_MILESTONE: Star,
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function ActivityFeed({
  activities,
  className,
}: {
  activities: ActivityItem[];
  className?: string;
}) {
  if (activities.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">No recent activity</p>
    );
  }

  return (
    <div className={cn('space-y-3', className)}>
      {activities.map((activity) => {
        const Icon = ICON_MAP[activity.type] || Star;

        return (
          <div key={activity.id} className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
              <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">{activity.title}</p>
              {activity.description && (
                <p className="text-xs text-muted-foreground">{activity.description}</p>
              )}
              <p className="mt-0.5 text-xs text-muted-foreground">{timeAgo(activity.createdAt)}</p>
            </div>
            {activity.xpGained != null && activity.xpGained > 0 && (
              <Badge variant="secondary" className="shrink-0 text-xs text-yellow-600">
                +{activity.xpGained} XP
              </Badge>
            )}
          </div>
        );
      })}
    </div>
  );
}
