'use client';

import { cn } from '@/lib/utils';

interface GradeBreakdown {
  levelScore: number;
  homeworkScore: number;
  quizScore: number;
}

interface GradeDisplayProps {
  grade: string;
  score?: number;
  breakdown?: GradeBreakdown;
  nextGrade?: string | null;
  pointsToNext?: number;
  size?: 'sm' | 'md' | 'lg';
  showBreakdown?: boolean;
  className?: string;
}

const GRADE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  E: { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-300' },
  D: { bg: 'bg-stone-100', text: 'text-stone-600', border: 'border-stone-300' },
  C: { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-300' },
  B: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-300' },
  A: { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-300' },
  S: { bg: 'bg-yellow-100', text: 'text-yellow-600', border: 'border-yellow-300' },
  'S+': { bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-300' },
};

const sizes = {
  sm: { badge: 'h-8 w-8 text-sm', label: 'text-xs' },
  md: { badge: 'h-12 w-12 text-xl', label: 'text-sm' },
  lg: { badge: 'h-16 w-16 text-3xl', label: 'text-base' },
};

export function GradeDisplay({
  grade,
  score,
  breakdown,
  nextGrade,
  pointsToNext,
  size = 'md',
  showBreakdown = false,
  className,
}: GradeDisplayProps) {
  const colors = GRADE_COLORS[grade] ?? GRADE_COLORS.E!;
  const sizeConfig = sizes[size];

  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <div
        className={cn(
          'flex items-center justify-center rounded-lg border-2 font-bold',
          colors.bg,
          colors.text,
          colors.border,
          sizeConfig.badge,
        )}
      >
        {grade}
      </div>

      {score !== undefined && (
        <span className={cn('font-medium text-muted-foreground', sizeConfig.label)}>
          {Math.round(score)} pts
        </span>
      )}

      {showBreakdown && breakdown && (
        <div className="w-full space-y-1.5">
          <BreakdownBar label="Level" value={breakdown.levelScore} weight={30} />
          <BreakdownBar label="Homework" value={breakdown.homeworkScore} weight={35} />
          <BreakdownBar label="Quiz" value={breakdown.quizScore} weight={35} />
        </div>
      )}

      {nextGrade && pointsToNext !== undefined && pointsToNext > 0 && (
        <p className="text-xs text-muted-foreground">
          {Math.round(pointsToNext)} pts to {nextGrade}
        </p>
      )}
    </div>
  );
}

function BreakdownBar({
  label,
  value,
  weight,
}: {
  label: string;
  value: number;
  weight: number;
}) {
  const contribution = (value * weight) / 100;

  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-16 shrink-0 text-muted-foreground">{label}</span>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary/60 transition-all"
          style={{ width: `${Math.min(100, value)}%` }}
        />
      </div>
      <span className="w-8 shrink-0 text-right text-muted-foreground">
        {Math.round(contribution)}
      </span>
    </div>
  );
}
