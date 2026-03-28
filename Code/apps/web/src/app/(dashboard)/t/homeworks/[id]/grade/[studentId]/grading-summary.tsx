'use client';

import { ArrowLeft, ArrowRight, CheckCircle, Star, Trophy } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  result: {
    score: number;
    percentage: number;
    maxScore: number;
    passingScore: number;
    passed: boolean;
    xpAwarded: number;
    xpReason: string;
    leveledUp: boolean;
    newLevel: number;
    achievementsUnlocked?: Array<{ id: string; name: string; icon: string; rarity: string }>;
  };
  studentName: string;
  hasNextUngraded: boolean;
  onGradeNext: () => void;
  onBackToSubmissions: () => void;
}

export function GradingSummary({
  result,
  studentName,
  hasNextUngraded,
  onGradeNext,
  onBackToSubmissions,
}: Props) {
  return (
    <Card>
      <CardHeader className="text-center">
        <CheckCircle className="mx-auto h-10 w-10 text-green-500" />
        <CardTitle className="mt-2 text-base">Graded Successfully</CardTitle>
        <p className="text-sm text-muted-foreground">{studentName}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Score */}
        <div className="flex items-center justify-between rounded-lg border p-3">
          <span className="text-sm text-muted-foreground">Score</span>
          <span className="text-lg font-bold">
            {result.score}/{result.maxScore}{' '}
            <Badge variant="secondary" className="ml-1">
              {Math.round(result.percentage)}%
            </Badge>
          </span>
        </div>

        {/* Pass/Fail */}
        <div className="flex items-center justify-between rounded-lg border p-3">
          <span className="text-sm text-muted-foreground">Result</span>
          {result.passed ? (
            <Badge variant="default">Passed</Badge>
          ) : (
            <Badge variant="destructive">Failed</Badge>
          )}
        </div>

        {/* XP */}
        <div className="flex items-center justify-between rounded-lg border p-3">
          <span className="text-sm text-muted-foreground">XP Awarded</span>
          <span className="font-semibold text-yellow-600">+{result.xpAwarded} XP</span>
        </div>

        {/* Level up */}
        {result.leveledUp && (
          <div className="flex items-center gap-2 rounded-lg border border-primary bg-primary/5 p-3">
            <Star className="h-5 w-5 text-yellow-500" />
            <span className="text-sm font-medium">
              Student leveled up to Level {result.newLevel}!
            </span>
          </div>
        )}

        {/* Achievements */}
        {result.achievementsUnlocked && result.achievementsUnlocked.length > 0 && (
          <div className="space-y-2">
            {result.achievementsUnlocked.map((a) => (
              <div
                key={a.id}
                className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-950"
              >
                <Trophy className="h-4 w-4 text-amber-600" />
                <span className="text-sm">
                  {a.icon} {a.name}
                </span>
                <Badge variant="outline" className="ml-auto text-xs">
                  {a.rarity}
                </Badge>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-2 pt-2">
          {hasNextUngraded && (
            <Button onClick={onGradeNext} className="w-full">
              Grade Next Ungraded
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
          <Button variant="outline" onClick={onBackToSubmissions} className="w-full">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Submissions
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
