'use client';

import { Brain, Plus } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import { CreateQuizDialog } from './create-quiz-dialog';

interface QuizSummary {
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
  availableFrom: string | null;
  availableUntil: string | null;
  createdAt: string;
  _count: { results: number };
}

const TYPE_LABELS: Record<string, string> = {
  DIAGNOSTIC: 'Diagnostic',
  PRACTICE: 'Practice',
  TEST: 'Test',
  EXAM: 'Exam',
  BOSS_BATTLE: 'Boss Battle',
};

export function QuizzesTab({ classId }: { classId: string }) {
  const [quizzes, setQuizzes] = useState<QuizSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);

  async function fetchQuizzes() {
    setIsLoading(true);
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

  useEffect(() => {
    fetchQuizzes();
  }, [classId]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Quiz
        </Button>
      </div>

      {isLoading ? (
        <p className="py-8 text-center text-muted-foreground">Loading...</p>
      ) : quizzes.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Brain className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-lg font-medium">No quizzes yet</p>
            <p className="text-muted-foreground">Create your first quiz</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {quizzes.map((quiz) => (
            <Link key={quiz.id} href={`/t/quizzes/${quiz.id}`}>
              <Card className="transition-colors hover:border-primary">
                <CardContent className="flex items-center justify-between py-4">
                  <div>
                    <p className="font-medium">
                      {quiz.isBossBattle && '🐉 '}
                      {quiz.title}
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {quiz.totalQuestions} questions · {quiz.totalPoints} pts
                      {quiz.timeLimit && ` · ${Math.floor(quiz.timeLimit / 60)} min`}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={quiz.isBossBattle ? 'destructive' : 'secondary'}
                    >
                      {TYPE_LABELS[quiz.type] || quiz.type}
                    </Badge>
                    <Badge variant="outline">
                      {quiz._count.results} attempts
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <CreateQuizDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        classId={classId}
        onCreated={fetchQuizzes}
      />
    </div>
  );
}
