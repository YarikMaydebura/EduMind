'use client';

import { Loader2, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classId: string;
  onCreated: () => void;
}

interface QuestionOption {
  text: string;
  isCorrect: boolean;
}

interface Question {
  type: 'MCQ' | 'TRUE_FALSE' | 'SHORT_ANSWER';
  question: string;
  options: QuestionOption[];
  correctAnswer: string;
  points: number;
  explanation: string;
}

const QUIZ_TYPES = [
  { value: 'PRACTICE', label: 'Practice' },
  { value: 'TEST', label: 'Test' },
  { value: 'EXAM', label: 'Exam' },
  { value: 'DIAGNOSTIC', label: 'Diagnostic' },
  { value: 'BOSS_BATTLE', label: 'Boss Battle' },
];

function emptyQuestion(): Question {
  return {
    type: 'MCQ',
    question: '',
    options: [
      { text: '', isCorrect: true },
      { text: '', isCorrect: false },
    ],
    correctAnswer: '',
    points: 10,
    explanation: '',
  };
}

export function CreateQuizDialog({ open, onOpenChange, classId, onCreated }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);

  // Step 1: Settings
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [quizType, setQuizType] = useState('PRACTICE');
  const [timeLimit, setTimeLimit] = useState('');
  const [shuffleQuestions, setShuffleQuestions] = useState(true);
  const [showCorrectAnswers, setShowCorrectAnswers] = useState(true);
  const [allowRetakes, setAllowRetakes] = useState(false);
  const [maxAttempts, setMaxAttempts] = useState(1);
  const [isBossBattle, setIsBossBattle] = useState(false);
  const [bossName, setBossName] = useState('');

  // Step 2: Questions
  const [questions, setQuestions] = useState<Question[]>([emptyQuestion()]);

  function resetForm() {
    setStep(1);
    setTitle('');
    setDescription('');
    setQuizType('PRACTICE');
    setTimeLimit('');
    setShuffleQuestions(true);
    setShowCorrectAnswers(true);
    setAllowRetakes(false);
    setMaxAttempts(1);
    setIsBossBattle(false);
    setBossName('');
    setQuestions([emptyQuestion()]);
  }

  function updateQuestion(index: number, updates: Partial<Question>) {
    setQuestions((prev) => prev.map((q, i) => (i === index ? { ...q, ...updates } : q)));
  }

  function updateOption(qIndex: number, oIndex: number, updates: Partial<QuestionOption>) {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== qIndex) return q;
        const newOptions = q.options.map((o, j) => (j === oIndex ? { ...o, ...updates } : o));
        return { ...q, options: newOptions };
      }),
    );
  }

  function setCorrectOption(qIndex: number, oIndex: number) {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== qIndex) return q;
        return {
          ...q,
          options: q.options.map((o, j) => ({ ...o, isCorrect: j === oIndex })),
        };
      }),
    );
  }

  function addOption(qIndex: number) {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== qIndex) return q;
        return { ...q, options: [...q.options, { text: '', isCorrect: false }] };
      }),
    );
  }

  function removeOption(qIndex: number, oIndex: number) {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== qIndex || q.options.length <= 2) return q;
        return { ...q, options: q.options.filter((_, j) => j !== oIndex) };
      }),
    );
  }

  function changeQuestionType(qIndex: number, type: Question['type']) {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== qIndex) return q;
        if (type === 'TRUE_FALSE') {
          return {
            ...q,
            type,
            options: [
              { text: 'True', isCorrect: true },
              { text: 'False', isCorrect: false },
            ],
          };
        }
        if (type === 'SHORT_ANSWER') {
          return { ...q, type, options: [], correctAnswer: '' };
        }
        // MCQ
        return {
          ...q,
          type,
          options:
            q.options.length >= 2
              ? q.options
              : [
                  { text: '', isCorrect: true },
                  { text: '', isCorrect: false },
                ],
        };
      }),
    );
  }

  async function handleSubmit() {
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (questions.length === 0) {
      toast.error('Add at least one question');
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        title,
        description: description || undefined,
        type: quizType,
        questions: questions.map((q) => ({
          type: q.type,
          question: q.question,
          points: q.points,
          explanation: q.explanation || undefined,
          ...(q.type === 'SHORT_ANSWER'
            ? { correctAnswer: q.correctAnswer }
            : { options: q.options }),
        })),
        timeLimit: timeLimit ? Number(timeLimit) * 60 : undefined, // Convert minutes to seconds
        shuffleQuestions,
        showCorrectAnswers,
        allowRetakes,
        maxAttempts,
        isBossBattle,
        bossName: isBossBattle && bossName ? bossName : undefined,
      };

      const res = await fetch(`/api/classes/${classId}/quizzes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!json.success) {
        toast.error(json.message || 'Failed to create quiz');
        return;
      }

      toast.success('Quiz created!');
      resetForm();
      onOpenChange(false);
      onCreated();
    } catch {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }

  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) resetForm();
        onOpenChange(v);
      }}
    >
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Quiz — Step {step}</DialogTitle>
          <DialogDescription>
            {step === 1 ? 'Configure quiz settings' : `Add questions (${totalPoints} pts total)`}
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Chapter 5 Review"
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Description (optional)</Label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Quiz description..."
                disabled={isLoading}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Quiz Type</Label>
                <select
                  value={quizType}
                  onChange={(e) => setQuizType(e.target.value)}
                  disabled={isLoading}
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                >
                  {QUIZ_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Time Limit (minutes, optional)</Label>
                <Input
                  type="number"
                  min={1}
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(e.target.value)}
                  placeholder="No limit"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={shuffleQuestions}
                  onChange={(e) => setShuffleQuestions(e.target.checked)}
                />
                Shuffle questions
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={showCorrectAnswers}
                  onChange={(e) => setShowCorrectAnswers(e.target.checked)}
                />
                Show correct answers
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={allowRetakes}
                  onChange={(e) => setAllowRetakes(e.target.checked)}
                />
                Allow retakes
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={isBossBattle}
                  onChange={(e) => setIsBossBattle(e.target.checked)}
                />
                Boss Battle
              </label>
            </div>

            {allowRetakes && (
              <div className="space-y-2">
                <Label>Max Attempts</Label>
                <Input
                  type="number"
                  min={1}
                  max={10}
                  value={maxAttempts}
                  onChange={(e) => setMaxAttempts(Number(e.target.value))}
                  disabled={isLoading}
                />
              </div>
            )}

            {isBossBattle && (
              <div className="space-y-2">
                <Label>Boss Name</Label>
                <Input
                  value={bossName}
                  onChange={(e) => setBossName(e.target.value)}
                  placeholder="e.g. The Math Dragon"
                  disabled={isLoading}
                />
              </div>
            )}

            <Button onClick={() => setStep(2)} className="w-full" disabled={!title.trim()}>
              Next — Add Questions
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            {questions.map((q, qIdx) => (
              <div key={qIdx} className="rounded-lg border p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">Question {qIdx + 1}</Badge>
                  <div className="flex items-center gap-2">
                    <select
                      value={q.type}
                      onChange={(e) =>
                        changeQuestionType(qIdx, e.target.value as Question['type'])
                      }
                      className="rounded-md border bg-background px-2 py-1 text-xs"
                    >
                      <option value="MCQ">Multiple Choice</option>
                      <option value="TRUE_FALSE">True / False</option>
                      <option value="SHORT_ANSWER">Short Answer</option>
                    </select>
                    <Input
                      type="number"
                      min={1}
                      max={100}
                      value={q.points}
                      onChange={(e) => updateQuestion(qIdx, { points: Number(e.target.value) })}
                      className="w-20"
                      title="Points"
                    />
                    <span className="text-xs text-muted-foreground">pts</span>
                    {questions.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => setQuestions((prev) => prev.filter((_, i) => i !== qIdx))}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </div>

                <textarea
                  value={q.question}
                  onChange={(e) => updateQuestion(qIdx, { question: e.target.value })}
                  placeholder="Enter your question..."
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                  rows={2}
                />

                {(q.type === 'MCQ' || q.type === 'TRUE_FALSE') && (
                  <div className="space-y-2">
                    {q.options.map((opt, oIdx) => (
                      <div key={oIdx} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`correct-${qIdx}`}
                          checked={opt.isCorrect}
                          onChange={() => setCorrectOption(qIdx, oIdx)}
                        />
                        <Input
                          value={opt.text}
                          onChange={(e) => updateOption(qIdx, oIdx, { text: e.target.value })}
                          placeholder={`Option ${oIdx + 1}`}
                          className="flex-1"
                          disabled={q.type === 'TRUE_FALSE'}
                        />
                        {q.type === 'MCQ' && q.options.length > 2 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => removeOption(qIdx, oIdx)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    ))}
                    {q.type === 'MCQ' && q.options.length < 6 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => addOption(qIdx)}
                        className="text-xs"
                      >
                        <Plus className="mr-1 h-3 w-3" />
                        Add Option
                      </Button>
                    )}
                  </div>
                )}

                {q.type === 'SHORT_ANSWER' && (
                  <div className="space-y-2">
                    <Label className="text-xs">Correct Answer</Label>
                    <Input
                      value={q.correctAnswer}
                      onChange={(e) => updateQuestion(qIdx, { correctAnswer: e.target.value })}
                      placeholder="Expected answer (case-insensitive match)"
                    />
                  </div>
                )}

                <Input
                  value={q.explanation}
                  onChange={(e) => updateQuestion(qIdx, { explanation: e.target.value })}
                  placeholder="Explanation (optional, shown after grading)"
                  className="text-xs"
                />
              </div>
            ))}

            <Button
              variant="outline"
              className="w-full"
              onClick={() => setQuestions((prev) => [...prev, emptyQuestion()])}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Question
            </Button>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                Back
              </Button>
              <Button onClick={handleSubmit} disabled={isLoading} className="flex-1">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Quiz ({questions.length} Q, {totalPoints} pts)
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
