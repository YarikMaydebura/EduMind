'use client';

import { CalendarDays, Clock, Plus } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import { CreateLessonDialog } from './create-lesson-dialog';

interface LessonSummary {
  id: string;
  title: string;
  topic: string;
  scheduledAt: string;
  duration: number;
  status: string;
  _count: { attendance: number };
}

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  SCHEDULED: 'outline',
  IN_PROGRESS: 'secondary',
  COMPLETED: 'default',
  CANCELLED: 'destructive',
};

export function LessonsTab({ classId }: { classId: string }) {
  const [lessons, setLessons] = useState<LessonSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [createOpen, setCreateOpen] = useState(false);

  async function fetchLessons() {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set('status', statusFilter);

      const res = await fetch(`/api/classes/${classId}/lessons?${params}`);
      const json = await res.json();
      if (json.success) setLessons(json.data);
    } catch {
      toast.error('Failed to load lessons');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchLessons();
  }, [statusFilter]);

  // Group lessons by date
  const grouped: Record<string, LessonSummary[]> = {};
  for (const lesson of lessons) {
    const date = new Date(lesson.scheduledAt).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push(lesson);
  }

  const statuses = ['', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          {statuses.map((s) => (
            <Button
              key={s}
              variant={statusFilter === s ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(s)}
            >
              {s ? s.replace('_', ' ') : 'All'}
            </Button>
          ))}
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Lesson
        </Button>
      </div>

      {isLoading ? (
        <p className="py-8 text-center text-muted-foreground">Loading...</p>
      ) : lessons.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <CalendarDays className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-lg font-medium">No lessons yet</p>
            <p className="text-muted-foreground">Create your first lesson to get started</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([date, dateLessons]) => (
            <div key={date}>
              <h3 className="mb-3 text-sm font-semibold text-muted-foreground">{date}</h3>
              <div className="space-y-2">
                {dateLessons.map((lesson) => (
                  <Link key={lesson.id} href={`/t/lessons/${lesson.id}`}>
                    <Card className="transition-colors hover:border-primary">
                      <CardContent className="flex items-center justify-between py-4">
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="font-medium">{lesson.title}</p>
                            <p className="text-sm text-muted-foreground">{lesson.topic}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="h-3.5 w-3.5" />
                            {new Date(lesson.scheduledAt).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                          <Badge variant="outline">{lesson.duration}m</Badge>
                          <Badge variant={STATUS_VARIANT[lesson.status] || 'outline'}>
                            {lesson.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <CreateLessonDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        classId={classId}
        onCreated={fetchLessons}
      />
    </div>
  );
}
