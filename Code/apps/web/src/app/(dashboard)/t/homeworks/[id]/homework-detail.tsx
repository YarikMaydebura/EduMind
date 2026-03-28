'use client';

import { ArrowLeft, CalendarDays, ClipboardList, Loader2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface HomeworkData {
  id: string;
  title: string;
  description: string;
  instructions: string | null;
  dueAt: string;
  assignedAt: string;
  maxScore: number;
  passingScore: number;
  class: { id: string; name: string; subject: string };
  teacher: { user: { firstName: string; lastName: string } };
  _count: { submissions: number };
}

interface SubmissionRow {
  studentId: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
  status: string;
  score: number | null;
  percentage: number | null;
  xpEarned: number;
  isLate: boolean;
  submittedAt: string;
  gradedAt: string | null;
}

type Tab = 'details' | 'submissions';

export function HomeworkDetail({ homeworkId }: { homeworkId: string }) {
  const router = useRouter();
  const [homework, setHomework] = useState<HomeworkData | null>(null);
  const [submissions, setSubmissions] = useState<SubmissionRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('details');
  const [actionLoading, setActionLoading] = useState(false);

  async function fetchHomework() {
    try {
      const res = await fetch(`/api/homeworks/${homeworkId}`);
      const json = await res.json();
      if (json.success) setHomework(json.data);
    } catch {
      toast.error('Failed to load homework');
    }
  }

  async function fetchSubmissions() {
    try {
      const res = await fetch(`/api/homeworks/${homeworkId}/submissions`);
      const json = await res.json();
      if (json.success) setSubmissions(json.data);
    } catch {
      toast.error('Failed to load submissions');
    }
  }

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      await Promise.all([fetchHomework(), fetchSubmissions()]);
      setIsLoading(false);
    }
    load();
  }, [homeworkId]);

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this homework? This cannot be undone.')) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/homeworks/${homeworkId}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        toast.success('Homework deleted');
        router.push(`/t/classes/${homework?.class.id}`);
      } else {
        toast.error(json.message || 'Failed to delete');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setActionLoading(false);
    }
  }

  if (isLoading || !homework) {
    return (
      <div className="container py-8">
        <p className="text-center text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const isOverdue = new Date(homework.dueAt) < new Date();

  const tabs: { key: Tab; label: string }[] = [
    { key: 'details', label: 'Details' },
    { key: 'submissions', label: `Submissions (${submissions.length})` },
  ];

  return (
    <div className="container py-8">
      <Link
        href={`/t/classes/${homework.class.id}`}
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to {homework.class.name}
      </Link>

      <div className="mb-6 flex items-start justify-between">
        <div>
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
            {isOverdue && <Badge variant="destructive">Overdue</Badge>}
            <Badge variant="outline">Max {homework.maxScore} pts</Badge>
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

      {activeTab === 'details' && <DetailsSection homework={homework} />}
      {activeTab === 'submissions' && (
        <SubmissionsSection
          submissions={submissions}
          homework={homework}
        />
      )}
    </div>
  );
}

function DetailsSection({ homework }: { homework: HomeworkData }) {
  return (
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

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Max Score</p>
            <p className="text-xl font-semibold">{homework.maxScore}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Passing Score</p>
            <p className="text-xl font-semibold">{homework.passingScore}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Submissions</p>
            <p className="text-xl font-semibold">{homework._count.submissions}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SubmissionsSection({
  submissions,
  homework,
}: {
  submissions: SubmissionRow[];
  homework: HomeworkData;
}) {
  const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
    SUBMITTED: 'secondary',
    GRADED: 'default',
    RETURNED: 'outline',
  };

  // Grading stats
  const graded = submissions.filter((s) => s.status === 'GRADED' || s.status === 'RETURNED');
  const ungraded = submissions.filter((s) => s.status === 'SUBMITTED');
  const avgPercentage =
    graded.length > 0
      ? graded.reduce((sum, s) => sum + (s.percentage || 0), 0) / graded.length
      : 0;
  const passCount = graded.filter((s) => (s.score || 0) >= homework.passingScore).length;
  const passRate = graded.length > 0 ? (passCount / graded.length) * 100 : 0;

  if (submissions.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <ClipboardList className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <p className="text-lg font-medium">No submissions yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Grading stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Graded</p>
            <p className="text-xl font-semibold">
              {graded.length}/{submissions.length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Ungraded</p>
            <p className="text-xl font-semibold">{ungraded.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Avg Score</p>
            <p className="text-xl font-semibold">
              {graded.length > 0 ? `${Math.round(avgPercentage)}%` : '—'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Pass Rate</p>
            <p className="text-xl font-semibold">
              {graded.length > 0 ? `${Math.round(passRate)}%` : '—'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Submissions table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>XP</TableHead>
              <TableHead>Late</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead className="w-[100px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.map((s) => (
              <TableRow key={s.studentId}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {s.firstName[0]}
                        {s.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">
                      {s.firstName} {s.lastName}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={STATUS_VARIANT[s.status] || 'outline'}>
                    {s.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {s.score !== null ? (
                    <span>
                      {s.score}/{homework.maxScore}{' '}
                      <span className="text-muted-foreground">
                        ({Math.round(s.percentage || 0)}%)
                      </span>
                    </span>
                  ) : (
                    '—'
                  )}
                </TableCell>
                <TableCell>{s.xpEarned > 0 ? `+${s.xpEarned}` : '—'}</TableCell>
                <TableCell>
                  {s.isLate ? (
                    <Badge variant="destructive">Late</Badge>
                  ) : (
                    <span className="text-muted-foreground">On time</span>
                  )}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(s.submittedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </TableCell>
                <TableCell>
                  {s.status === 'SUBMITTED' && (
                    <Link href={`/t/homeworks/${homework.id}/grade/${s.studentId}`}>
                      <Button size="sm">Grade</Button>
                    </Link>
                  )}
                  {s.status === 'GRADED' && (
                    <Link href={`/t/homeworks/${homework.id}/grade/${s.studentId}`}>
                      <Button size="sm" variant="outline">
                        Re-grade
                      </Button>
                    </Link>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
