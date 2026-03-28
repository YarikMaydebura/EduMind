'use client';

import { CalendarDays, ClipboardList } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface HomeworkItem {
  id: string;
  title: string;
  description: string;
  dueAt: string;
  maxScore: number;
  submissions?: Array<{
    status: string;
    score: number | null;
    percentage: number | null;
  }>;
}

export function StudentHomeworks({ classId }: { classId: string }) {
  const [homeworks, setHomeworks] = useState<HomeworkItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchHomeworks() {
      try {
        const res = await fetch(`/api/classes/${classId}/homeworks`);
        const json = await res.json();
        if (json.success) setHomeworks(json.data);
      } catch {
        toast.error('Failed to load homeworks');
      } finally {
        setIsLoading(false);
      }
    }
    fetchHomeworks();
  }, [classId]);

  if (isLoading) {
    return <p className="py-4 text-center text-muted-foreground">Loading homeworks...</p>;
  }

  if (homeworks.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <ClipboardList className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
          <p className="text-muted-foreground">No homework assigned yet</p>
        </CardContent>
      </Card>
    );
  }

  const pending = homeworks.filter((hw) => {
    const sub = hw.submissions?.[0];
    return !sub || sub.status === 'ASSIGNED';
  });

  const completed = homeworks.filter((hw) => {
    const sub = hw.submissions?.[0];
    return sub && sub.status !== 'ASSIGNED';
  });

  return (
    <div className="space-y-6">
      {pending.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-semibold text-muted-foreground">Pending</h3>
          <div className="space-y-2">
            {pending.map((hw) => (
              <HomeworkCard key={hw.id} homework={hw} />
            ))}
          </div>
        </div>
      )}

      {completed.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-semibold text-muted-foreground">Completed</h3>
          <div className="space-y-2">
            {completed.map((hw) => (
              <HomeworkCard key={hw.id} homework={hw} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function HomeworkCard({ homework }: { homework: HomeworkItem }) {
  const sub = homework.submissions?.[0];
  const isOverdue = new Date(homework.dueAt) < new Date() && !sub;

  return (
    <Link href={`/s/homeworks/${homework.id}`}>
      <Card className="transition-colors hover:border-primary">
        <CardContent className="flex items-center justify-between py-4">
          <div>
            <p className="font-medium">{homework.title}</p>
            <p className="text-sm text-muted-foreground line-clamp-1">{homework.description}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <CalendarDays className="h-3.5 w-3.5" />
              {new Date(homework.dueAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </span>
            {isOverdue && <Badge variant="destructive">Overdue</Badge>}
            {sub?.status === 'SUBMITTED' && <Badge variant="secondary">Submitted</Badge>}
            {sub?.status === 'GRADED' && (
              <Badge variant="default">
                {sub.score}/{homework.maxScore} ({Math.round(sub.percentage || 0)}%)
              </Badge>
            )}
            {!sub && !isOverdue && <Badge variant="outline">Not submitted</Badge>}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
