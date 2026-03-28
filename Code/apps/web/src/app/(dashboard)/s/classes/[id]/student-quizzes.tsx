'use client';

import { Brain, Clock, Star } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface QuizItem {
  id: string;
  title: string;
  description: string | null;
  type: string;
  totalQuestions: number;
  totalPoints: number;
  timeLimit: number | null;
  isBossBattle: boolean;
  bossName: string | null;
  allowRetakes: boolean;
  maxAttempts: number;
  results?: Array<{
    id: string;
    score: number;
    percentage: number;
    attemptNumber: number;
    xpEarned: number;
  }>;
}

const TYPE_LABELS: Record<string, string> = {
  DIAGNOSTIC: 'Diagnostic',
  PRACTICE: 'Practice',
  TEST: 'Test',
  EXAM: 'Exam',
  BOSS_BATTLE: 'Boss Battle',
};

export function StudentQuizzes({ classId }: { classId: string }) {
  const [quizzes, setQuizzes] = useState<QuizItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchQuizzes() {
      try {
        const res = await fetch(`/api/classes/${classId}/quizzes`);
        const json = await res.json();
        if (json.success) setQuizzes(json.data);
      } catch {
        toast.error('Failed to load quizzes');
      } finally {
        setIsLoading(false);
      }
    }
    fetchQuizzes();
  }, [classId]);

  if (isLoading) {
    return <p className="py-4 text-center text-muted-foreground">Loading quizzes...</p>;
  }

  if (quizzes.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <Brain className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
          <p className="text-muted-foreground">No quizzes available yet</p>
        </CardContent>
      </Card>
    );
  }

  const available = quizzes.filter((q) => {
    const result = q.results?.[0];
    if (!result) return true;
    // Has result but retakes allowed and attempts remaining
    return q.allowRetakes && result.attemptNumber < q.maxAttempts;
  });

  const completed = quizzes.filter((q) => {
    const result = q.results?.[0];
    if (!result) return false;
    // No retakes or max attempts reached
    return !q.allowRetakes || result.attemptNumber >= q.maxAttempts;
  });

  return (
    <div className="space-y-6">
      {available.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-semibold text-muted-foreground">Available</h3>
          <div className="space-y-2">
            {available.map((q) => (
              <QuizCard key={q.id} quiz={q} />
            ))}
          </div>
        </div>
      )}

      {completed.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-semibold text-muted-foreground">Completed</h3>
          <div className="space-y-2">
            {completed.map((q) => (
              <QuizCard key={q.id} quiz={q} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function QuizCard({ quiz }: { quiz: QuizItem }) {
  const result = quiz.results?.[0];

  return (
    <Link href={`/s/quizzes/${quiz.id}`}>
      <Card className="transition-colors hover:border-primary">
        <CardContent className="flex items-center justify-between py-4">
          <div>
            <p className="font-medium">
              {quiz.isBossBattle && '🐉 '}
              {quiz.title}
            </p>
            <p className="text-sm text-muted-foreground">
              {quiz.totalQuestions} questions · {quiz.totalPoints} pts
              {quiz.timeLimit && (
                <span className="ml-2 inline-flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {Math.floor(quiz.timeLimit / 60)} min
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={quiz.isBossBattle ? 'destructive' : 'secondary'}>
              {TYPE_LABELS[quiz.type] || quiz.type}
            </Badge>
            {result ? (
              <Badge variant="default">
                {result.score}/{quiz.totalPoints} ({Math.round(result.percentage)}%)
              </Badge>
            ) : (
              <Badge variant="outline">Not attempted</Badge>
            )}
            {result && result.xpEarned > 0 && (
              <span className="flex items-center gap-1 text-sm text-yellow-600">
                <Star className="h-3.5 w-3.5" />+{result.xpEarned}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
