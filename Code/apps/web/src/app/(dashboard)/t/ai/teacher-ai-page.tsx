'use client';

import { BookOpen, Brain, CheckSquare, ClipboardList, Loader2, Sparkles, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { GeneratedLessonPlan } from '@/lib/ai/generate-lesson-plan';
import type { GeneratedQuestion } from '@/lib/ai/generate-quiz';

interface ClassInfo {
  id: string;
  name: string;
  subject: string;
  gradeYear: string;
  studentCount: number;
}

interface Props {
  classes: ClassInfo[];
}

// ─── Lesson Plan Dialog ────────────────────────────────────────────────────────

function LessonPlanDialog({
  open,
  onClose,
  classes,
}: {
  open: boolean;
  onClose: () => void;
  classes: ClassInfo[];
}) {
  const [classId, setClassId] = useState(classes[0]?.id ?? '');
  const [topic, setTopic] = useState('');
  const [duration, setDuration] = useState(45);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GeneratedLessonPlan | null>(null);

  const selectedClass = classes.find((c) => c.id === classId);

  async function handleGenerate() {
    if (!topic.trim() || !selectedClass) return;
    setIsLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/ai/lesson-plan/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: selectedClass.subject,
          gradeYear: selectedClass.gradeYear,
          topic,
          duration,
          classSize: selectedClass.studentCount || 20,
        }),
      });
      const json = await res.json();
      if (!json.success) {
        toast.error(json.message || 'Generation failed');
        return;
      }
      setResult(json.data as GeneratedLessonPlan);
    } catch {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }

  function handleClose() {
    setResult(null);
    setTopic('');
    setDuration(45);
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            Generate Lesson Plan
          </DialogTitle>
          <DialogDescription>AI will create a structured lesson plan for you</DialogDescription>
        </DialogHeader>

        {!result ? (
          <div className="space-y-4">
            {classes.length > 0 && (
              <div className="space-y-2">
                <Label>Class</Label>
                <select
                  value={classId}
                  onChange={(e) => setClassId(e.target.value)}
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} — {c.subject.replace(/_/g, ' ')}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="space-y-2">
              <Label>Topic</Label>
              <Input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Photosynthesis, World War II, Quadratic Equations"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label>Duration (minutes)</Label>
              <Input
                type="number"
                min={15}
                max={180}
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                disabled={isLoading}
              />
            </div>

            <Button
              className="w-full"
              onClick={handleGenerate}
              disabled={isLoading || !topic.trim()}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate with AI
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-lg border bg-muted/30 p-3">
              <p className="text-sm font-medium">Learning Objectives</p>
              <ul className="mt-1 space-y-1">
                {result.objectives.map((obj, i) => (
                  <li key={i} className="text-sm text-muted-foreground">
                    • {obj}
                  </li>
                ))}
              </ul>
            </div>

            {[
              { label: 'Warm-up', data: result.warmup, key: 'warmup' },
              { label: 'Introduction', data: result.introduction, key: 'introduction' },
              { label: 'Main Content', data: result.mainContent, key: 'mainContent' },
              { label: 'Activities', data: result.activities, key: 'activities' },
              { label: 'Conclusion', data: result.conclusion, key: 'conclusion' },
            ].map(({ label, data }) => (
              <div key={label} className="rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{label}</p>
                  <Badge variant="secondary" className="text-xs">
                    {data.duration} min
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {data.activity ?? data.content ?? data.description ?? data.summary}
                </p>
                {data.teacherTips && (
                  <p className="mt-1 text-xs text-blue-600">Tip: {data.teacherTips}</p>
                )}
              </div>
            ))}

            {result.materials.length > 0 && (
              <div className="rounded-lg border p-3">
                <p className="text-sm font-medium">Materials</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {result.materials.map((m, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {m}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setResult(null)}>
                Regenerate
              </Button>
              <Button className="flex-1" onClick={handleClose}>
                Done
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ─── Quiz Generator Dialog ─────────────────────────────────────────────────────

function QuizGeneratorDialog({
  open,
  onClose,
  classes,
}: {
  open: boolean;
  onClose: () => void;
  classes: ClassInfo[];
}) {
  const [classId, setClassId] = useState(classes[0]?.id ?? '');
  const [topic, setTopic] = useState('');
  const [numQuestions, setNumQuestions] = useState(10);
  const [difficulty, setDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD'>('MEDIUM');
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState<GeneratedQuestion[] | null>(null);

  const selectedClass = classes.find((c) => c.id === classId);

  async function handleGenerate() {
    if (!topic.trim() || !selectedClass) return;
    setIsLoading(true);
    setQuestions(null);
    try {
      const res = await fetch('/api/ai/quiz/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: selectedClass.subject,
          gradeYear: selectedClass.gradeYear,
          topic,
          numQuestions,
          difficulty,
          questionTypes: ['MULTIPLE_CHOICE', 'TRUE_FALSE'],
        }),
      });
      const json = await res.json();
      if (!json.success) {
        toast.error(json.message || 'Generation failed');
        return;
      }
      setQuestions(json.data as GeneratedQuestion[]);
    } catch {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }

  function handleClose() {
    setQuestions(null);
    setTopic('');
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-500" />
            Generate Quiz Questions
          </DialogTitle>
          <DialogDescription>AI will create quiz questions you can use or edit</DialogDescription>
        </DialogHeader>

        {!questions ? (
          <div className="space-y-4">
            {classes.length > 0 && (
              <div className="space-y-2">
                <Label>Class</Label>
                <select
                  value={classId}
                  onChange={(e) => setClassId(e.target.value)}
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} — {c.subject.replace(/_/g, ' ')}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="space-y-2">
              <Label>Topic</Label>
              <Input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. The French Revolution, Algebra basics"
                disabled={isLoading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Number of Questions</Label>
                <Input
                  type="number"
                  min={3}
                  max={20}
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(Number(e.target.value))}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label>Difficulty</Label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as typeof difficulty)}
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                >
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                </select>
              </div>
            </div>

            <Button
              className="w-full"
              onClick={handleGenerate}
              disabled={isLoading || !topic.trim()}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating {numQuestions} questions...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate with AI
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {questions.length} questions generated. Copy them into your quiz.
            </p>
            {questions.map((q, i) => (
              <div key={i} className="rounded-lg border p-3 space-y-2">
                <div className="flex items-start gap-2">
                  <Badge variant="secondary" className="mt-0.5 shrink-0 text-xs">
                    Q{i + 1}
                  </Badge>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{q.text}</p>
                    {q.options.length > 0 && (
                      <ul className="mt-1 space-y-0.5">
                        {q.options.map((opt, j) => (
                          <li
                            key={j}
                            className={`text-xs ${opt === q.correctAnswer ? 'font-semibold text-green-600' : 'text-muted-foreground'}`}
                          >
                            {String.fromCharCode(65 + j)}. {opt}
                          </li>
                        ))}
                      </ul>
                    )}
                    {q.explanation && (
                      <p className="mt-1 text-xs text-blue-600">Explanation: {q.explanation}</p>
                    )}
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">{q.points}pt</span>
                </div>
              </div>
            ))}

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setQuestions(null)}>
                Regenerate
              </Button>
              <Button className="flex-1" onClick={handleClose}>
                Done
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export function TeacherAiPage({ classes }: Props) {
  const [lessonPlanOpen, setLessonPlanOpen] = useState(false);
  const [quizGenOpen, setQuizGenOpen] = useState(false);

  const QUICK_ACTIONS = [
    {
      icon: BookOpen,
      iconColor: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      title: 'Generate Lesson Plan',
      description: 'Create a structured lesson plan with objectives, activities, and tips.',
      action: () => setLessonPlanOpen(true),
      badge: 'Advanced AI',
    },
    {
      icon: Brain,
      iconColor: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      title: 'Generate Quiz',
      description: 'Auto-generate quiz questions for any topic and difficulty level.',
      action: () => setQuizGenOpen(true),
      badge: 'Advanced AI',
    },
    {
      icon: CheckSquare,
      iconColor: 'text-green-500',
      bgColor: 'bg-green-500/10',
      title: 'AI Homework Grading',
      description: 'Use AI to suggest grades and feedback on homework submissions.',
      action: () => {
        window.location.href = '/t/homeworks';
      },
      badge: 'Fast AI',
    },
    {
      icon: ClipboardList,
      iconColor: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      title: 'Progress Analysis',
      description: 'AI-powered insights on student performance and learning gaps.',
      action: () => {},
      badge: 'Coming soon',
      disabled: true,
    },
  ];

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="flex items-center gap-3 text-3xl font-bold">
          <Sparkles className="h-8 w-8 text-purple-500" />
          AI Assistant
        </h1>
        <p className="mt-2 text-muted-foreground">
          Powered by AI — generate lesson plans, quizzes, and more in seconds.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
        {QUICK_ACTIONS.map((action) => (
          <Card
            key={action.title}
            className={`transition-all ${action.disabled ? 'opacity-60' : 'cursor-pointer hover:shadow-md hover:border-primary/30'}`}
            onClick={action.disabled ? undefined : action.action}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className={`rounded-lg p-2.5 ${action.bgColor}`}>
                  <action.icon className={`h-5 w-5 ${action.iconColor}`} />
                </div>
                <Badge
                  variant={action.badge === 'Coming soon' ? 'outline' : 'secondary'}
                  className="text-xs"
                >
                  {action.badge}
                </Badge>
              </div>
              <CardTitle className="text-base">{action.title}</CardTitle>
              <CardDescription className="text-sm">{action.description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Button
                variant="outline"
                size="sm"
                disabled={action.disabled}
                onClick={(e) => {
                  e.stopPropagation();
                  action.action();
                }}
                className="w-full"
              >
                {action.disabled ? (
                  'Coming in Phase 4.2'
                ) : (
                  <>
                    <Sparkles className="mr-2 h-3.5 w-3.5" />
                    Open
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {classes.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-3 text-sm font-medium text-muted-foreground">Your Classes</h2>
          <div className="flex flex-wrap gap-2">
            {classes.map((c) => (
              <Badge key={c.id} variant="outline">
                {c.name} · {c.subject.replace(/_/g, ' ')}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 rounded-lg border bg-muted/30 p-4">
        <p className="text-xs text-muted-foreground">
          <span className="font-medium">Models used:</span> Complex tasks (lesson plans, quizzes)
          use an advanced AI model for higher quality. Simple tasks (homework grading, hints) use a
          fast AI model for speed and cost efficiency.
        </p>
      </div>

      <LessonPlanDialog
        open={lessonPlanOpen}
        onClose={() => setLessonPlanOpen(false)}
        classes={classes}
      />
      <QuizGeneratorDialog
        open={quizGenOpen}
        onClose={() => setQuizGenOpen(false)}
        classes={classes}
      />
    </div>
  );
}
