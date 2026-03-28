'use client';

import { ArrowLeft, CalendarDays, CheckCircle, Clock, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface LessonData {
  id: string;
  title: string;
  topic: string;
  description: string | null;
  scheduledAt: string;
  duration: number;
  status: string;
  class: { id: string; name: string; subject: string };
  teacher: {
    user: { firstName: string; lastName: string };
  };
  attendance: Array<{
    present: boolean;
    participationScore: number | null;
    notes: string | null;
  }>;
}

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  SCHEDULED: 'outline',
  IN_PROGRESS: 'secondary',
  COMPLETED: 'default',
  CANCELLED: 'destructive',
};

export function StudentLessonDetail({ lessonId }: { lessonId: string }) {
  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchLesson() {
      try {
        const res = await fetch(`/api/lessons/${lessonId}`);
        const json = await res.json();
        if (json.success) setLesson(json.data);
      } catch {
        toast.error('Failed to load lesson');
      } finally {
        setIsLoading(false);
      }
    }
    fetchLesson();
  }, [lessonId]);

  if (isLoading || !lesson) {
    return (
      <div className="container py-8">
        <p className="text-center text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const myAttendance = lesson.attendance[0];

  return (
    <div className="container py-8">
      <Link
        href={`/s/classes/${lesson.class.id}`}
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to {lesson.class.name}
      </Link>

      <div className="mb-6">
        <h1 className="text-3xl font-bold">{lesson.title}</h1>
        <div className="mt-2 flex items-center gap-3">
          <Badge variant="secondary">{lesson.class.subject.replace(/_/g, ' ')}</Badge>
          <Badge variant={STATUS_VARIANT[lesson.status] || 'outline'}>
            {lesson.status.replace('_', ' ')}
          </Badge>
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <CalendarDays className="h-3.5 w-3.5" />
            {new Date(lesson.scheduledAt).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
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
        </div>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Topic</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{lesson.topic}</p>
          </CardContent>
        </Card>

        {lesson.description && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>{lesson.description}</p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Teacher</p>
            <p className="text-lg font-semibold">
              {lesson.teacher.user.firstName} {lesson.teacher.user.lastName}
            </p>
          </CardContent>
        </Card>

        {lesson.status === 'COMPLETED' && myAttendance && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Your Attendance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {myAttendance.present ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  <span className="font-medium">
                    {myAttendance.present ? 'Present' : 'Absent'}
                  </span>
                </div>
                {myAttendance.participationScore !== null && (
                  <Badge variant="secondary">
                    Participation: {myAttendance.participationScore}/10
                  </Badge>
                )}
              </div>
              {myAttendance.notes && (
                <p className="mt-2 text-sm text-muted-foreground">{myAttendance.notes}</p>
              )}
            </CardContent>
          </Card>
        )}

        {lesson.status === 'COMPLETED' && !myAttendance && (
          <Card>
            <CardContent className="py-6 text-center text-muted-foreground">
              No attendance record found for this lesson
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
