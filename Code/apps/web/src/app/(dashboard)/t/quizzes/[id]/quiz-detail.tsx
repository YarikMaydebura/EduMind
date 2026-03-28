'use client';

import { ArrowLeft, Brain, CheckCircle, Loader2, Trash2, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface QuizData {
  id: string;
  title: string;
  description: string | null;
  type: string;
  totalQuestions: number;
  totalPoints: number;
  timeLimit: number | null;
  shuffleQuestions: boolean;
  showCorrectAnswers: boolean;
  allowRetakes: boolean;
  maxAttempts: number;
  isBossBattle: boolean;
  bossName: string | null;
  difficulty: number;
  questions: Array<{
    type: string;
    question: string;
    options?: Array<{ text: string; isCorrect: boolean }>;
    correctAnswer?: string;
    points: number;
    explanation?: string;
  }>;
  class: { id: string; name: string; subject: string };
  teacher: { user: { firstName: string; lastName: string } };
  _count: { results: number };
}

interface ResultRow {
  id: string;
  attemptNumber: number;
  score: number;
  percentage: number;
  correctAnswers: number;
  totalQuestions: number;
  xpEarned: number;
  timeSpent: number | null;
  bossDefeated: boolean | null;
  createdAt: string;
  student: {
    id: string;
    user: { firstName: string; lastName: string };
  };
}

const TYPE_LABELS: Record<string, string> = {
  DIAGNOSTIC: 'Diagnostic',
  PRACTICE: 'Practice',
  TEST: 'Test',
  EXAM: 'Exam',
  BOSS_BATTLE: 'Boss Battle',
};

type Tab = 'details' | 'results';

export function QuizDetail({ quizId }: { quizId: string }) {
  const router = useRouter();
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [results, setResults] = useState<ResultRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('details');
  const [actionLoading, setActionLoading] = useState(false);

  async function fetchQuiz() {
    try {
      const res = await fetch(`/api/quizzes/${quizId}`);
      const json = await res.json();
      if (json.success) setQuiz(json.data);
    } catch {
      toast.error('Failed to load quiz');
    }
  }

  async function fetchResults() {
    try {
      const res = await fetch(`/api/quizzes/${quizId}/attempts`);
      const json = await res.json();
      if (json.success) setResults(json.data);
    } catch {
      toast.error('Failed to load results');
    }
  }

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      await Promise.all([fetchQuiz(), fetchResults()]);
      setIsLoading(false);
    }
    load();
  }, [quizId]);

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this quiz? This cannot be undone.')) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/quizzes/${quizId}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        toast.success('Quiz deleted');
        router.push(`/t/classes/${quiz?.class.id}`);
      } else {
        toast.error(json.message || 'Failed to delete');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setActionLoading(false);
    }
  }

  if (isLoading || !quiz) {
    return (
      <div className="container py-8">
        <p className="text-center text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'details', label: 'Details' },
    { key: 'results', label: `Results (${results.length})` },
  ];

  return (
    <div className="container py-8">
      <Link
        href={`/t/classes/${quiz.class.id}`}
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to {quiz.class.name}
      </Link>

      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {quiz.isBossBattle && '🐉 '}
            {quiz.title}
          </h1>
          <div className="mt-2 flex items-center gap-3">
            <Badge variant="secondary">{quiz.class.subject.replace(/_/g, ' ')}</Badge>
            <Badge variant={quiz.isBossBattle ? 'destructive' : 'outline'}>
              {TYPE_LABELS[quiz.type] || quiz.type}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {quiz.totalQuestions} questions · {quiz.totalPoints} pts
            </span>
            {quiz.timeLimit && (
              <span className="text-sm text-muted-foreground">
                {Math.floor(quiz.timeLimit / 60)} min
              </span>
            )}
          </div>
        </div>

        <Button
          variant="destructive"
          size="sm"
          onClick={handleDelete}
          disabled={actionLoading}
        >
          {actionLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="mr-2 h-4 w-4" />
          )}
          Delete
        </Button>
      </div>

      <div className="mb-6 flex gap-1 rounded-lg border p-1">
        {tabs.map((tab) => (
          <Button
            key={tab.key}
            variant={activeTab === tab.key ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {activeTab === 'details' && <DetailsSection quiz={quiz} />}
      {activeTab === 'results' && <ResultsSection results={results} quiz={quiz} />}
    </div>
  );
}

function DetailsSection({ quiz }: { quiz: QuizData }) {
  return (
    <div className="space-y-4">
      {quiz.description && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Description
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{quiz.description}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Points</p>
            <p className="text-xl font-semibold">{quiz.totalPoints}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Attempts</p>
            <p className="text-xl font-semibold">{quiz._count.results}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Retakes</p>
            <p className="text-xl font-semibold">
              {quiz.allowRetakes ? `Up to ${quiz.maxAttempts}` : 'No'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Difficulty</p>
            <p className="text-xl font-semibold">{quiz.difficulty}/100</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Questions Preview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {quiz.questions.map((q, i) => (
            <div key={i} className="rounded-lg border p-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">
                  Q{i + 1}. {q.question}
                </p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {q.type === 'MCQ'
                      ? 'Multiple Choice'
                      : q.type === 'TRUE_FALSE'
                        ? 'True/False'
                        : 'Short Answer'}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {q.points} pts
                  </Badge>
                </div>
              </div>
              {q.options && (
                <div className="mt-2 space-y-1">
                  {q.options.map((o, j) => (
                    <div
                      key={j}
                      className={`flex items-center gap-2 text-sm ${
                        o.isCorrect ? 'text-green-600 font-medium' : 'text-muted-foreground'
                      }`}
                    >
                      {o.isCorrect ? (
                        <CheckCircle className="h-3.5 w-3.5" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5" />
                      )}
                      {o.text}
                    </div>
                  ))}
                </div>
              )}
              {q.correctAnswer && (
                <p className="mt-2 text-sm text-green-600">
                  <CheckCircle className="mr-1 inline h-3.5 w-3.5" />
                  {q.correctAnswer}
                </p>
              )}
              {q.explanation && (
                <p className="mt-1 text-xs text-muted-foreground italic">{q.explanation}</p>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function ResultsSection({ results, quiz }: { results: ResultRow[]; quiz: QuizData }) {
  if (results.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Brain className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <p className="text-lg font-medium">No results yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student</TableHead>
            <TableHead>Attempt</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Correct</TableHead>
            <TableHead>XP</TableHead>
            <TableHead>Time</TableHead>
            {quiz.isBossBattle && <TableHead>Boss</TableHead>}
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map((r) => (
            <TableRow key={r.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      {r.student.user.firstName[0]}
                      {r.student.user.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">
                    {r.student.user.firstName} {r.student.user.lastName}
                  </span>
                </div>
              </TableCell>
              <TableCell>#{r.attemptNumber}</TableCell>
              <TableCell>
                {r.score}/{quiz.totalPoints}{' '}
                <span className="text-muted-foreground">({Math.round(r.percentage)}%)</span>
              </TableCell>
              <TableCell>
                {r.correctAnswers}/{r.totalQuestions}
              </TableCell>
              <TableCell>+{r.xpEarned}</TableCell>
              <TableCell>
                {r.timeSpent ? `${Math.floor(r.timeSpent / 60)}m ${r.timeSpent % 60}s` : '—'}
              </TableCell>
              {quiz.isBossBattle && (
                <TableCell>
                  {r.bossDefeated ? (
                    <Badge variant="default">Defeated</Badge>
                  ) : (
                    <Badge variant="destructive">Failed</Badge>
                  )}
                </TableCell>
              )}
              <TableCell className="text-sm text-muted-foreground">
                {new Date(r.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
