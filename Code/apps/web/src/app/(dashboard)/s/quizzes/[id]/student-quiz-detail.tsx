'use client';

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Clock,
  Loader2,
  RotateCcw,
  Star,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import { showAchievementToast } from '@/components/gamification/achievement-toast';
import { showLevelUpToast } from '@/components/gamification/level-up-toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

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
  questions: Array<{
    type: string;
    question: string;
    points: number;
    options?: Array<{ text: string }>;
  }>;
  class: { id: string; name: string; subject: string };
  results: Array<{
    id: string;
    attemptNumber: number;
    score: number;
    percentage: number;
    correctAnswers: number;
    totalQuestions: number;
    xpEarned: number;
    timeSpent: number | null;
    bossDefeated: boolean | null;
  }>;
}

interface SubmitResult {
  score: number;
  totalPoints: number;
  percentage: number;
  correctAnswers: number;
  totalQuestions: number;
  xpEarned: number;
  xpReason: string;
  attemptNumber: number;
  bossDefeated?: boolean;
  leveledUp?: boolean;
  newLevel?: number;
  newTitle?: string | null;
  achievementsUnlocked?: Array<{
    id: string;
    name: string;
    icon: string;
    rarity: string;
    xpReward: number;
  }>;
  answers?: Array<{
    questionIndex: number;
    answer: string;
    correct: boolean;
    pointsEarned: number;
  }>;
  correctAnswersDetail?: Array<{
    questionIndex: number;
    question: string;
    correctAnswer: string;
    explanation?: string;
  }>;
}

type QuizState = 'info' | 'taking' | 'result';

const TYPE_LABELS: Record<string, string> = {
  DIAGNOSTIC: 'Diagnostic',
  PRACTICE: 'Practice',
  TEST: 'Test',
  EXAM: 'Exam',
  BOSS_BATTLE: 'Boss Battle',
};

export function StudentQuizDetail({ quizId }: { quizId: string }) {
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quizState, setQuizState] = useState<QuizState>('info');

  // Taking state
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Map<number, string>>(new Map());
  const [startedAt, setStartedAt] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Result state
  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null);

  async function fetchQuiz() {
    try {
      const res = await fetch(`/api/quizzes/${quizId}`);
      const json = await res.json();
      if (json.success) setQuiz(json.data);
    } catch {
      toast.error('Failed to load quiz');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchQuiz();
  }, [quizId]);

  const handleSubmitQuiz = useCallback(async () => {
    if (!quiz || isSubmitting) return;
    setIsSubmitting(true);

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    const now = new Date();
    const start = new Date(startedAt);
    const timeSpent = Math.floor((now.getTime() - start.getTime()) / 1000);

    try {
      const answersArray = Array.from(answers.entries()).map(([questionIndex, answer]) => ({
        questionIndex,
        answer,
      }));

      const res = await fetch(`/api/quizzes/${quizId}/attempts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers: answersArray,
          startedAt,
          timeSpent,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setSubmitResult(json.data);
        setQuizState('result');
        toast.success(`Quiz submitted! +${json.data.xpEarned} XP`);
        if (json.data.leveledUp && json.data.newLevel) {
          setTimeout(() => showLevelUpToast(json.data.newLevel, json.data.newTitle), 1000);
        }
        if (json.data.achievementsUnlocked?.length) {
          json.data.achievementsUnlocked.forEach(
            (achievement: { name: string; icon: string; rarity: string; xpReward: number }, i: number) => {
              setTimeout(() => showAchievementToast(achievement), 1500 + i * 800);
            },
          );
        }
      } else {
        toast.error(json.message || 'Failed to submit quiz');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  }, [quiz, isSubmitting, startedAt, answers, quizId]);

  // Timer effect
  useEffect(() => {
    if (quizState !== 'taking' || !quiz?.timeLimit || timeLeft === null) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [quizState, quiz?.timeLimit, timeLeft, handleSubmitQuiz]);

  function handleStartQuiz() {
    if (!quiz) return;
    const now = new Date().toISOString();
    setStartedAt(now);
    setCurrentQ(0);
    setAnswers(new Map());
    if (quiz.timeLimit) setTimeLeft(quiz.timeLimit);
    setQuizState('taking');
  }

  function handleRetry() {
    setSubmitResult(null);
    setQuizState('info');
    fetchQuiz();
  }

  function setAnswer(questionIndex: number, answer: string) {
    setAnswers((prev) => {
      const next = new Map(prev);
      next.set(questionIndex, answer);
      return next;
    });
  }

  if (isLoading || !quiz) {
    return (
      <div className="container py-8">
        <p className="text-center text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const bestResult = quiz.results?.[0];
  const attemptCount = quiz.results?.length || 0;
  const canAttempt = attemptCount === 0 || (quiz.allowRetakes && attemptCount < quiz.maxAttempts);

  return (
    <div className="container py-8">
      <Link
        href={`/s/classes/${quiz.class.id}`}
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to {quiz.class.name}
      </Link>

      {quizState === 'info' && (
        <InfoView
          quiz={quiz}
          bestResult={bestResult}
          attemptCount={attemptCount}
          canAttempt={canAttempt}
          onStart={handleStartQuiz}
        />
      )}

      {quizState === 'taking' && (
        <TakingView
          quiz={quiz}
          currentQ={currentQ}
          answers={answers}
          timeLeft={timeLeft}
          isSubmitting={isSubmitting}
          onAnswer={setAnswer}
          onNavigate={setCurrentQ}
          onPrev={() => setCurrentQ((p) => Math.max(0, p - 1))}
          onNext={() => setCurrentQ((p) => Math.min(quiz.totalQuestions - 1, p + 1))}
          onSubmit={handleSubmitQuiz}
        />
      )}

      {quizState === 'result' && submitResult && (
        <ResultView
          quiz={quiz}
          result={submitResult}
          canRetry={quiz.allowRetakes && submitResult.attemptNumber < quiz.maxAttempts}
          onRetry={handleRetry}
        />
      )}
    </div>
  );
}

function InfoView({
  quiz,
  bestResult,
  attemptCount,
  canAttempt,
  onStart,
}: {
  quiz: QuizData;
  bestResult?: QuizData['results'][0];
  attemptCount: number;
  canAttempt: boolean;
  onStart: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          {quiz.isBossBattle && '🐉 '}
          {quiz.title}
        </h1>
        <div className="mt-2 flex items-center gap-3">
          <Badge variant="secondary">{quiz.class.subject.replace(/_/g, ' ')}</Badge>
          <Badge variant={quiz.isBossBattle ? 'destructive' : 'outline'}>
            {TYPE_LABELS[quiz.type] || quiz.type}
          </Badge>
        </div>
      </div>

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
            <p className="text-sm text-muted-foreground">Questions</p>
            <p className="text-xl font-semibold">{quiz.totalQuestions}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Points</p>
            <p className="text-xl font-semibold">{quiz.totalPoints}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Time Limit</p>
            <p className="text-xl font-semibold">
              {quiz.timeLimit ? `${Math.floor(quiz.timeLimit / 60)} min` : 'None'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Attempts</p>
            <p className="text-xl font-semibold">
              {attemptCount}/{quiz.maxAttempts}
            </p>
          </CardContent>
        </Card>
      </div>

      {bestResult && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Best Result
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Score</p>
                <p className="text-2xl font-bold">
                  {bestResult.score}/{quiz.totalPoints}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Percentage</p>
                <p className="text-2xl font-bold">{Math.round(bestResult.percentage)}%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">XP Earned</p>
                <p className="flex items-center gap-1 text-2xl font-bold">
                  <Star className="h-5 w-5 text-yellow-500" />+{bestResult.xpEarned}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {canAttempt ? (
        <Button onClick={onStart} size="lg" className="w-full">
          {attemptCount > 0 ? (
            <>
              <RotateCcw className="mr-2 h-4 w-4" />
              Retry Quiz
            </>
          ) : (
            'Start Quiz'
          )}
        </Button>
      ) : (
        <Card>
          <CardContent className="py-6 text-center">
            <p className="text-muted-foreground">Maximum attempts reached</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function TakingView({
  quiz,
  currentQ,
  answers,
  timeLeft,
  isSubmitting,
  onAnswer,
  onNavigate,
  onPrev,
  onNext,
  onSubmit,
}: {
  quiz: QuizData;
  currentQ: number;
  answers: Map<number, string>;
  timeLeft: number | null;
  isSubmitting: boolean;
  onAnswer: (index: number, answer: string) => void;
  onNavigate: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
  onSubmit: () => void;
}) {
  const question = quiz.questions[currentQ];
  if (!question) return null;

  const answeredCount = answers.size;
  const isLast = currentQ === quiz.totalQuestions - 1;

  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  return (
    <div className="space-y-4">
      {/* Progress bar and timer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Badge variant="secondary">
            Question {currentQ + 1} of {quiz.totalQuestions}
          </Badge>
          <span className="text-sm text-muted-foreground">
            {answeredCount}/{quiz.totalQuestions} answered
          </span>
        </div>
        {timeLeft !== null && (
          <Badge variant={timeLeft < 60 ? 'destructive' : 'outline'} className="text-sm">
            <Clock className="mr-1 h-3.5 w-3.5" />
            {formatTime(timeLeft)}
          </Badge>
        )}
      </div>

      <div className="h-2 rounded-full bg-muted">
        <div
          className="h-2 rounded-full bg-primary transition-all"
          style={{ width: `${((currentQ + 1) / quiz.totalQuestions) * 100}%` }}
        />
      </div>

      {/* Question card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{question.question}</CardTitle>
            <Badge variant="outline">{question.points} pts</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {(question.type === 'MCQ' || question.type === 'TRUE_FALSE') && question.options && (
            <div className="space-y-2">
              {question.options.map((opt, i) => {
                const isSelected = answers.get(currentQ) === opt.text;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => onAnswer(currentQ, opt.text)}
                    className={`w-full rounded-lg border p-3 text-left text-sm transition-colors ${
                      isSelected
                        ? 'border-primary bg-primary/10 font-medium'
                        : 'hover:border-primary/50'
                    }`}
                  >
                    <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full border text-xs">
                      {String.fromCharCode(65 + i)}
                    </span>
                    {opt.text}
                  </button>
                );
              })}
            </div>
          )}

          {question.type === 'SHORT_ANSWER' && (
            <Input
              value={answers.get(currentQ) || ''}
              onChange={(e) => onAnswer(currentQ, e.target.value)}
              placeholder="Type your answer..."
              className="text-base"
            />
          )}
        </CardContent>
      </Card>

      {/* Question navigation dots */}
      <div className="flex flex-wrap justify-center gap-1">
        {quiz.questions.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onNavigate(i)}
            className={`h-7 w-7 rounded text-xs font-medium transition-colors ${
              i === currentQ
                ? 'bg-primary text-primary-foreground'
                : answers.has(i)
                  ? 'bg-primary/20 text-primary'
                  : 'bg-muted text-muted-foreground'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Navigation buttons */}
      <div className="flex gap-2">
        <Button variant="outline" onClick={onPrev} disabled={currentQ === 0} className="flex-1">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>

        {isLast ? (
          <Button
            onClick={() => {
              if (answeredCount < quiz.totalQuestions) {
                if (
                  !confirm(
                    `You have ${quiz.totalQuestions - answeredCount} unanswered questions. Submit anyway?`,
                  )
                )
                  return;
              }
              onSubmit();
            }}
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle className="mr-2 h-4 w-4" />
            )}
            Submit Quiz
          </Button>
        ) : (
          <Button onClick={onNext} className="flex-1">
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

function ResultView({
  quiz,
  result,
  canRetry,
  onRetry,
}: {
  quiz: QuizData;
  result: SubmitResult;
  canRetry: boolean;
  onRetry: () => void;
}) {
  const passed = result.percentage >= 60;

  return (
    <div className="space-y-4">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold">
          {quiz.isBossBattle
            ? result.bossDefeated
              ? '🎉 Boss Defeated!'
              : '💀 Boss Survived...'
            : passed
              ? '🎉 Quiz Complete!'
              : 'Quiz Complete'}
        </h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground">Score</p>
            <p className="text-2xl font-bold">
              {result.score}/{result.totalPoints}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground">Percentage</p>
            <p className="text-2xl font-bold">{Math.round(result.percentage)}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground">Correct</p>
            <p className="text-2xl font-bold">
              {result.correctAnswers}/{result.totalQuestions}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground">XP Earned</p>
            <p className="flex items-center justify-center gap-1 text-2xl font-bold">
              <Star className="h-5 w-5 text-yellow-500" />+{result.xpEarned}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="py-4 text-center">
          <p className="text-muted-foreground">{result.xpReason}</p>
        </CardContent>
      </Card>

      {/* Correct answers breakdown */}
      {result.correctAnswersDetail && result.answers && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Answer Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {result.correctAnswersDetail.map((detail, i) => {
              const studentAnswer = result.answers?.find((a) => a.questionIndex === i);
              return (
                <div key={i} className="rounded-lg border p-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium">
                      Q{i + 1}. {detail.question}
                    </p>
                    {studentAnswer?.correct ? (
                      <CheckCircle className="h-4 w-4 shrink-0 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 shrink-0 text-red-500" />
                    )}
                  </div>
                  {studentAnswer && !studentAnswer.correct && (
                    <p className="mt-1 text-sm text-red-600">
                      Your answer: {studentAnswer.answer}
                    </p>
                  )}
                  <p className="mt-1 text-sm text-green-600">
                    Correct: {detail.correctAnswer}
                  </p>
                  {detail.explanation && (
                    <p className="mt-1 text-xs text-muted-foreground italic">
                      {detail.explanation}
                    </p>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      <div className="flex gap-2">
        <Link href={`/s/classes/${quiz.class.id}`} className="flex-1">
          <Button variant="outline" className="w-full">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Class
          </Button>
        </Link>
        {canRetry && (
          <Button onClick={onRetry} className="flex-1">
            <RotateCcw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
}
