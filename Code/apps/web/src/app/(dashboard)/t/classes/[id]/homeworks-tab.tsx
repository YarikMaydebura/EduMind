'use client';

import { CalendarDays, ClipboardList, Plus } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import { CreateHomeworkDialog } from './create-homework-dialog';

interface HomeworkSummary {
  id: string;
  title: string;
  description: string;
  dueAt: string;
  maxScore: number;
  assignedAt: string;
  _count: { submissions: number };
}

export function HomeworksTab({ classId }: { classId: string }) {
  const [homeworks, setHomeworks] = useState<HomeworkSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);

  async function fetchHomeworks() {
    setIsLoading(true);
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

  useEffect(() => {
    fetchHomeworks();
  }, [classId]);

  function getDueStatus(dueAt: string) {
    const due = new Date(dueAt);
    const now = new Date();
    const diffMs = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { label: 'Overdue', variant: 'destructive' as const };
    if (diffDays === 0) return { label: 'Due today', variant: 'secondary' as const };
    if (diffDays <= 3) return { label: `Due in ${diffDays}d`, variant: 'secondary' as const };
    return { label: `Due in ${diffDays}d`, variant: 'outline' as const };
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Homework
        </Button>
      </div>

      {isLoading ? (
        <p className="py-8 text-center text-muted-foreground">Loading...</p>
      ) : homeworks.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <ClipboardList className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-lg font-medium">No homeworks yet</p>
            <p className="text-muted-foreground">Create your first homework assignment</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {homeworks.map((hw) => {
            const dueStatus = getDueStatus(hw.dueAt);
            return (
              <Link key={hw.id} href={`/t/homeworks/${hw.id}`}>
                <Card className="transition-colors hover:border-primary">
                  <CardContent className="flex items-center justify-between py-4">
                    <div>
                      <p className="font-medium">{hw.title}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {hw.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {new Date(hw.dueAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      <Badge variant={dueStatus.variant}>{dueStatus.label}</Badge>
                      <Badge variant="outline">
                        {hw._count.submissions} submitted
                      </Badge>
                      <Badge variant="outline">Max {hw.maxScore}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}

      <CreateHomeworkDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        classId={classId}
        onCreated={fetchHomeworks}
      />
    </div>
  );
}
