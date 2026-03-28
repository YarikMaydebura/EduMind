'use client';

import { CalendarDays, Clock } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface LessonItem {
  id: string;
  title: string;
  topic: string;
  scheduledAt: string;
  duration: number;
  status: string;
}

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  SCHEDULED: 'outline',
  IN_PROGRESS: 'secondary',
  COMPLETED: 'default',
  CANCELLED: 'destructive',
};

export function StudentLessons({ classId }: { classId: string }) {
  const [lessons, setLessons] = useState<LessonItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchLessons() {
      try {
        const res = await fetch(`/api/classes/${classId}/lessons`);
        const json = await res.json();
        if (json.success) setLessons(json.data);
      } catch {
        toast.error('Failed to load lessons');
      } finally {
        setIsLoading(false);
      }
    }
    fetchLessons();
  }, [classId]);

  if (isLoading) {
    return <p className="py-4 text-center text-muted-foreground">Loading lessons...</p>;
  }

  const now = new Date();
  const upcoming = lessons.filter(
    (l) => l.status === 'SCHEDULED' || l.status === 'IN_PROGRESS',
  );
  const past = lessons.filter(
    (l) => l.status === 'COMPLETED' || l.status === 'CANCELLED',
  );

  if (lessons.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <CalendarDays className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
          <p className="text-muted-foreground">No lessons scheduled yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {upcoming.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-semibold text-muted-foreground">Upcoming</h3>
          <div className="space-y-2">
            {upcoming.map((lesson) => (
              <LessonCard key={lesson.id} lesson={lesson} />
            ))}
          </div>
        </div>
      )}

      {past.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-semibold text-muted-foreground">Past</h3>
          <div className="space-y-2">
            {past.map((lesson) => (
              <LessonCard key={lesson.id} lesson={lesson} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function LessonCard({ lesson }: { lesson: LessonItem }) {
  return (
    <Link href={`/s/lessons/${lesson.id}`}>
      <Card className="transition-colors hover:border-primary">
        <CardContent className="flex items-center justify-between py-4">
          <div>
            <p className="font-medium">{lesson.title}</p>
            <p className="text-sm text-muted-foreground">{lesson.topic}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <CalendarDays className="h-3.5 w-3.5" />
              {new Date(lesson.scheduledAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </span>
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
  );
}
