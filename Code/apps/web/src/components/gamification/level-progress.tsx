import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface LevelProgressProps {
  level: number;
  currentXP: number;
  neededXP: number;
  progress: number;
  className?: string;
}

export function LevelProgress({
  level,
  currentXP,
  neededXP,
  progress,
  className,
}: LevelProgressProps) {
  const progressPercent = Math.round(progress * 100);

  return (
    <div className={cn('space-y-1.5', className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">Level {level}</span>
        <span className="text-muted-foreground">
          {currentXP}/{neededXP} XP to Level {level + 1}
        </span>
      </div>
      <Progress value={progressPercent} />
    </div>
  );
}
