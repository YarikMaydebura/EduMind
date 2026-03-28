'use client';

import { ArrowLeft, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import type { RubricCriterion } from '@edumind/shared';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { GradingForm } from './grading-form';
import { GradingSummary } from './grading-summary';

interface HomeworkData {
  id: string;
  title: string;
  description: string;
  instructions: string | null;
  maxScore: number;
  passingScore: number;
  rubric: RubricCriterion[] | null;
}

interface SubmissionData {
  id: string;
  content: string | null;
  submittedAt: string;
  isLate: boolean;
  status: string;
  score: number | null;
  percentage: number | null;
  rubricScores: Array<{ criterionId: string; score: number; feedback?: string }> | null;
  teacherFeedback: string | null;
  student: {
    id: string;
    user: { firstName: string; lastName: string; avatar: string | null };
  };
}

interface SubmissionListItem {
  studentId: string;
  firstName: string;
  lastName: string;
  status: string;
}

interface GradeResult {
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
}

interface Props {
  homeworkId: string;
  studentId: string;
}

export function GradingPage({ homeworkId, studentId }: Props) {
  const router = useRouter();
  const [homework, setHomework] = useState<HomeworkData | null>(null);
  const [submission, setSubmission] = useState<SubmissionData | null>(null);
  const [allSubmissions, setAllSubmissions] = useState<SubmissionListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [gradeResult, setGradeResult] = useState<GradeResult | null>(null);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      setGradeResult(null);
      try {
        const [hwRes, subRes, listRes] = await Promise.all([
          fetch(`/api/homeworks/${homeworkId}`),
          fetch(`/api/homeworks/${homeworkId}/submissions/${studentId}`),
          fetch(`/api/homeworks/${homeworkId}/submissions`),
        ]);

        const hwJson = await hwRes.json();
        const subJson = await subRes.json();
        const listJson = await listRes.json();

        if (hwJson.success) {
          setHomework({
            id: hwJson.data.id,
            title: hwJson.data.title,
            description: hwJson.data.description,
            instructions: hwJson.data.instructions,
            maxScore: hwJson.data.maxScore,
            passingScore: hwJson.data.passingScore,
            rubric: hwJson.data.rubric ?? null,
          });
        }

        if (subJson.success) setSubmission(subJson.data);
        if (listJson.success) setAllSubmissions(listJson.data);
      } catch {
        toast.error('Failed to load grading data');
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [homeworkId, studentId]);

  if (isLoading || !homework || !submission) {
    return (
      <div className="container py-8">
        <p className="text-center text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const currentIndex = allSubmissions.findIndex((s) => s.studentId === studentId);
  const prevStudent = currentIndex > 0 ? allSubmissions[currentIndex - 1] : null;
  const nextStudent =
    currentIndex < allSubmissions.length - 1 ? allSubmissions[currentIndex + 1] : null;

  const nextUngraded = allSubmissions.find(
    (s) => s.status === 'SUBMITTED' && s.studentId !== studentId,
  );

  function handleGraded(result: GradeResult) {
    setGradeResult(result);
  }

  function goToNext() {
    if (nextUngraded) {
      router.push(`/t/homeworks/${homeworkId}/grade/${nextUngraded.studentId}`);
    } else if (nextStudent) {
      router.push(`/t/homeworks/${homeworkId}/grade/${nextStudent.studentId}`);
    }
  }

  const student = submission.student;
  const initials = `${student.user.firstName[0]}${student.user.lastName[0]}`;

  return (
    <div className="container py-6">
      {/* Top navigation bar */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          href={`/t/homeworks/${homeworkId}`}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to {homework.title}
        </Link>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={!prevStudent}
            onClick={() =>
              prevStudent &&
              router.push(`/t/homeworks/${homeworkId}/grade/${prevStudent.studentId}`)
            }
          >
            <ChevronLeft className="h-4 w-4" />
            Prev
          </Button>
          <span className="text-sm text-muted-foreground">
            {currentIndex + 1} of {allSubmissions.length}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={!nextStudent}
            onClick={() =>
              nextStudent &&
              router.push(`/t/homeworks/${homeworkId}/grade/${nextStudent.studentId}`)
            }
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Split layout */}
      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        {/* Left panel — Student submission */}
        <div className="space-y-4">
          {/* Student info */}
          <Card>
            <CardContent className="flex items-center gap-4 pt-6">
              <Avatar className="h-10 w-10">
                <AvatarImage src={student.user.avatar ?? undefined} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">
                  {student.user.firstName} {student.user.lastName}
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  Submitted {new Date(submission.submittedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                  {submission.isLate && (
                    <Badge variant="destructive" className="ml-1">
                      Late
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Homework instructions (collapsible) */}
          {homework.instructions && (
            <details className="group">
              <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
                Homework Instructions
              </summary>
              <Card className="mt-2">
                <CardContent className="pt-4">
                  <p className="whitespace-pre-wrap text-sm">{homework.instructions}</p>
                </CardContent>
              </Card>
            </details>
          )}

          {/* Student's answer */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Student&apos;s Answer
              </CardTitle>
            </CardHeader>
            <CardContent>
              {submission.content ? (
                <div className="max-h-[600px] overflow-y-auto">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">
                    {submission.content}
                  </p>
                </div>
              ) : (
                <p className="text-sm italic text-muted-foreground">
                  No text content submitted.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right panel — Grading form or summary */}
        <div className="lg:sticky lg:top-20 lg:self-start">
          {gradeResult ? (
            <GradingSummary
              result={gradeResult}
              studentName={`${student.user.firstName} ${student.user.lastName}`}
              hasNextUngraded={!!nextUngraded}
              onGradeNext={goToNext}
              onBackToSubmissions={() => router.push(`/t/homeworks/${homeworkId}`)}
            />
          ) : (
            <GradingForm
              homeworkId={homeworkId}
              studentId={studentId}
              maxScore={homework.maxScore}
              passingScore={homework.passingScore}
              rubric={homework.rubric}
              isLate={submission.isLate}
              existingScore={submission.score}
              existingFeedback={submission.teacherFeedback}
              existingRubricScores={submission.rubricScores}
              isAlreadyGraded={submission.status === 'GRADED'}
              instructions={homework.instructions ?? ''}
              content={submission.content ?? ''}
              onGraded={handleGraded}
            />
          )}
        </div>
      </div>
    </div>
  );
}
