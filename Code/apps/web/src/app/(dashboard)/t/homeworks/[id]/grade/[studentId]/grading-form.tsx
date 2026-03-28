'use client';

import { Loader2, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import type { RubricCriterion } from '@edumind/shared';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { AiGradeSuggestion } from '@/lib/ai/suggest-grade';

interface Props {
  homeworkId: string;
  studentId: string;
  maxScore: number;
  passingScore: number;
  rubric: RubricCriterion[] | null;
  isLate: boolean;
  existingScore: number | null;
  existingFeedback: string | null;
  existingRubricScores: Array<{ criterionId: string; score: number; feedback?: string }> | null;
  isAlreadyGraded: boolean;
  instructions: string;
  content: string;
  onGraded: (result: {
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
  }) => void;
}

interface FormData {
  score: number;
  teacherFeedback: string;
  rubricScores: Array<{ criterionId: string; score: number; feedback: string }>;
}

export function GradingForm({
  homeworkId,
  studentId,
  maxScore,
  passingScore,
  rubric,
  isLate,
  existingScore,
  existingFeedback,
  existingRubricScores,
  isAlreadyGraded,
  instructions,
  content,
  onGraded,
}: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const defaultRubricScores = rubric
    ? rubric.map((c) => {
        const existing = existingRubricScores?.find((rs) => rs.criterionId === c.id);
        return {
          criterionId: c.id,
          score: existing?.score ?? 0,
          feedback: existing?.feedback ?? '',
        };
      })
    : [];

  const { register, handleSubmit, watch, setValue, getValues } = useForm<FormData>({
    defaultValues: {
      score: existingScore ?? 0,
      teacherFeedback: existingFeedback ?? '',
      rubricScores: defaultRubricScores,
    },
  });

  const scoreValue = watch('score');
  const rubricScoresValue = watch('rubricScores');

  // Auto-calculate total from rubric scores
  const rubricTotal = rubric
    ? rubricScoresValue.reduce((sum, rs) => sum + (Number(rs.score) || 0), 0)
    : null;

  const displayScore = rubric ? (rubricTotal ?? 0) : Number(scoreValue) || 0;
  const percentage = maxScore > 0 ? Math.round((displayScore / maxScore) * 100) : 0;

  function getXpPreview() {
    const pct = (displayScore / maxScore) * 100;
    if (isLate && pct < 100) return 10;
    if (pct >= 100) return 70;
    if (pct >= 90) return 40;
    if (pct >= 80) return 30;
    return 20;
  }

  async function handleAiSuggest() {
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/ai/homework/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          homeworkId,
          studentId,
          instructions,
          content,
          maxScore,
          rubric: rubric ?? undefined,
        }),
      });

      const json = await res.json();
      const suggestion: AiGradeSuggestion | null = json.success ? json.data : null;

      if (!suggestion) {
        toast.error(json.message ?? 'AI suggestion failed');
        return;
      }

      setValue('score', suggestion.score);
      setValue('teacherFeedback', suggestion.feedback);
      if (suggestion.rubricScores && rubric) {
        for (let i = 0; i < rubric.length; i++) {
          const criterion = rubric[i];
          if (!criterion) continue;
          const rs = suggestion.rubricScores.find((s) => s.criterionId === criterion.id);
          if (rs) {
            setValue(`rubricScores.${i}.score`, rs.score);
            if (rs.feedback) setValue(`rubricScores.${i}.feedback`, rs.feedback);
          }
        }
      }
      toast.success('AI suggestion applied — review and adjust before submitting');
    } catch {
      toast.error('AI suggestion failed');
    } finally {
      setIsAiLoading(false);
    }
  }

  async function onSubmit(data: FormData) {
    const finalScore = rubric
      ? data.rubricScores.reduce((sum, rs) => sum + (Number(rs.score) || 0), 0)
      : Number(data.score);

    setIsSubmitting(true);
    try {
      const body: Record<string, unknown> = {
        score: finalScore,
        teacherFeedback: data.teacherFeedback || undefined,
      };

      if (rubric && data.rubricScores) {
        body.rubricScores = data.rubricScores.map((rs) => ({
          criterionId: rs.criterionId,
          score: Number(rs.score),
          feedback: rs.feedback || undefined,
        }));
      }

      const res = await fetch(`/api/homeworks/${homeworkId}/submissions/${studentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      if (json.success) {
        onGraded(json.data);
      } else {
        toast.error(json.message || 'Failed to grade');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-base">
          <span>{isAlreadyGraded ? 'Re-grade Submission' : 'Grade Submission'}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleAiSuggest}
            disabled={isAiLoading || isSubmitting}
          >
            {isAiLoading ? (
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
            ) : (
              <Sparkles className="mr-1.5 h-3.5 w-3.5" />
            )}
            AI Suggest
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {rubric ? (
            /* Rubric-based scoring */
            <div className="space-y-3">
              <Label className="text-sm font-medium">Rubric Criteria</Label>
              {rubric.map((criterion, i) => (
                <div key={criterion.id} className="rounded-lg border p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium">{criterion.name}</span>
                    <span className="text-xs text-muted-foreground">
                      max {criterion.maxPoints}
                    </span>
                  </div>
                  {criterion.description && (
                    <p className="mb-2 text-xs text-muted-foreground">{criterion.description}</p>
                  )}
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min={0}
                      max={criterion.maxPoints}
                      {...register(`rubricScores.${i}.score`, { valueAsNumber: true })}
                      disabled={isSubmitting}
                      className="w-20"
                    />
                    <span className="text-sm text-muted-foreground">/ {criterion.maxPoints}</span>
                  </div>
                  <input type="hidden" {...register(`rubricScores.${i}.criterionId`)} />
                  <Input
                    placeholder="Criterion feedback (optional)"
                    {...register(`rubricScores.${i}.feedback`)}
                    disabled={isSubmitting}
                    className="mt-2 text-xs"
                  />
                </div>
              ))}
              <div className="flex items-center justify-between rounded-md border bg-muted/50 px-3 py-2">
                <span className="text-sm font-medium">Total Score</span>
                <span className="text-lg font-bold">
                  {rubricTotal}/{maxScore}
                  <Badge variant="secondary" className="ml-2">
                    {percentage}%
                  </Badge>
                </span>
              </div>
            </div>
          ) : (
            /* Simple scoring */
            <div className="space-y-2">
              <Label htmlFor="score">Score</Label>
              <div className="flex items-center gap-3">
                <Input
                  id="score"
                  type="number"
                  min={0}
                  max={maxScore}
                  {...register('score', { valueAsNumber: true })}
                  disabled={isSubmitting}
                  required
                  className="w-28"
                />
                <span className="text-muted-foreground">/ {maxScore}</span>
                <Badge variant="secondary">{percentage}%</Badge>
              </div>
            </div>
          )}

          {/* XP preview */}
          <div className="rounded-md border bg-muted/50 px-3 py-2 text-sm">
            XP to award: <span className="font-semibold">+{getXpPreview()}</span>
            {isLate && (
              <span className="ml-2 text-xs text-muted-foreground">(late penalty applied)</span>
            )}
          </div>

          {/* Pass/fail indicator */}
          <div className="text-sm">
            {displayScore >= passingScore ? (
              <Badge variant="default">Pass ({passingScore}+ required)</Badge>
            ) : (
              <Badge variant="destructive">Fail ({passingScore}+ required)</Badge>
            )}
          </div>

          {/* Feedback */}
          <div className="space-y-2">
            <Label htmlFor="teacherFeedback">Feedback (optional)</Label>
            <textarea
              id="teacherFeedback"
              placeholder="Provide feedback for the student..."
              {...register('teacherFeedback')}
              disabled={isSubmitting}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              rows={5}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isAlreadyGraded ? 'Update Grade' : 'Submit Grade'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
