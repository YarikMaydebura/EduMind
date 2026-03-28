'use client';

import { ArrowLeft, CalendarDays, CheckCircle, Loader2, Star } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface RubricCriterion {
  id: string;
  name: string;
  maxPoints: number;
  description?: string;
}

interface RubricScore {
  criterionId: string;
  score: number;
  feedback?: string;
}

interface HomeworkData {
  id: string;
  title: string;
  description: string;
  instructions: string | null;
  dueAt: string;
  maxScore: number;
  passingScore: number;
  rubric: RubricCriterion[] | null;
  class: { id: string; name: string; subject: string };
  teacher: { user: { firstName: string; lastName: string } };
  submissions: Array<{
    content: string | null;
    status: string;
    score: number | null;
    percentage: number | null;
    xpEarned: number;
    isLate: boolean;
    teacherFeedback: string | null;
    rubricScores: RubricScore[] | null;
    submittedAt: string;
  }>;
}

export function StudentHomeworkDetail({ homeworkId }: { homeworkId: string }) {
  const [homework, setHomework] = useState<HomeworkData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function fetchHomework() {
    try {
      const res = await fetch(`/api/homeworks/${homeworkId}`);
      const json = await res.json();
      if (json.success) setHomework(json.data);
    } catch {
      toast.error('Failed to load homework');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchHomework();
  }, [homeworkId]);

  async function handleSubmit() {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/homeworks/${homeworkId}/submissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: content || undefined }),
      });

      const json = await res.json();
      if (json.success) {
        toast.success('Homework submitted!');
        fetchHomework();
      } else {
        toast.error(json.message || 'Failed to submit');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading || !homework) {
    return (
      <div className="container py-8">
        <p className="text-center text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const submission = homework.submissions[0];
  const isOverdue = new Date(homework.dueAt) < new Date();
  const canSubmit = !submission;

  return (
    <div className="container py-8">
      <Link
        href={`/s/classes/${homework.class.id}`}
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to {homework.class.name}
      </Link>

      <div className="mb-6">
        <h1 className="text-3xl font-bold">{homework.title}</h1>
        <div className="mt-2 flex items-center gap-3">
          <Badge variant="secondary">{homework.class.subject.replace(/_/g, ' ')}</Badge>
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <CalendarDays className="h-3.5 w-3.5" />
            Due{' '}
            {new Date(homework.dueAt).toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </span>
          {isOverdue && !submission && <Badge variant="destructive">Overdue</Badge>}
          {submission?.isLate && <Badge variant="destructive">Late</Badge>}
          <Badge variant="outline">Max {homework.maxScore} pts</Badge>
        </div>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{homework.description}</p>
          </CardContent>
        </Card>

        {homework.instructions && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Instructions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{homework.instructions}</p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Teacher</p>
            <p className="text-lg font-semibold">
              {homework.teacher.user.firstName} {homework.teacher.user.lastName}
            </p>
          </CardContent>
        </Card>

        {/* Submission form */}
        {canSubmit && (
          <Card>
            <CardHeader>
              <CardTitle>Your Submission</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your answer here..."
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                rows={8}
              />
              <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full">
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle className="mr-2 h-4 w-4" />
                )}
                Submit Homework
                {isOverdue && ' (Late)'}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Submitted view */}
        {submission && submission.status === 'SUBMITTED' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Submitted
              </CardTitle>
            </CardHeader>
            <CardContent>
              {submission.content && (
                <p className="whitespace-pre-wrap">{submission.content}</p>
              )}
              <p className="mt-2 text-sm text-muted-foreground">
                Submitted on{' '}
                {new Date(submission.submittedAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
                . Waiting for grading.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Graded view */}
        {submission && (submission.status === 'GRADED' || submission.status === 'RETURNED') && (
          <Card>
            <CardHeader>
              <CardTitle>Your Grade</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-sm text-muted-foreground">Score</p>
                  <p className="text-2xl font-bold">
                    {submission.score}/{homework.maxScore}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Percentage</p>
                  <p className="text-2xl font-bold">{Math.round(submission.percentage || 0)}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">XP Earned</p>
                  <p className="flex items-center gap-1 text-2xl font-bold">
                    <Star className="h-5 w-5 text-yellow-500" />
                    +{submission.xpEarned}
                  </p>
                </div>
                <div>
                  <Badge
                    variant={
                      (submission.score || 0) >= homework.passingScore
                        ? 'default'
                        : 'destructive'
                    }
                  >
                    {(submission.score || 0) >= homework.passingScore ? 'Passed' : 'Failed'}
                  </Badge>
                </div>
              </div>

              {/* Rubric breakdown */}
              {homework.rubric &&
                homework.rubric.length > 0 &&
                submission.rubricScores &&
                submission.rubricScores.length > 0 && (
                  <div>
                    <p className="mb-2 text-sm font-medium text-muted-foreground">
                      Rubric Breakdown
                    </p>
                    <div className="space-y-2">
                      {homework.rubric.map((criterion) => {
                        const rs = submission.rubricScores?.find(
                          (s) => s.criterionId === criterion.id,
                        );
                        return (
                          <div
                            key={criterion.id}
                            className="rounded-md border bg-muted/30 p-3"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">{criterion.name}</span>
                              <span className="text-sm font-semibold">
                                {rs?.score ?? '—'}/{criterion.maxPoints}
                              </span>
                            </div>
                            {rs?.feedback && (
                              <p className="mt-1 text-xs text-muted-foreground">
                                {rs.feedback}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

              {submission.teacherFeedback && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Teacher Feedback</p>
                  <p className="mt-1 whitespace-pre-wrap rounded-md border bg-muted/50 p-3 text-sm">
                    {submission.teacherFeedback}
                  </p>
                </div>
              )}

              {submission.content && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Your Answer</p>
                  <p className="mt-1 whitespace-pre-wrap rounded-md border p-3 text-sm">
                    {submission.content}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
