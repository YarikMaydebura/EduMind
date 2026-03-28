'use client';

import {
  ArrowLeft,
  CalendarDays,
  CheckCircle,
  Clock,
  Loader2,
  Play,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { AttendanceForm } from './attendance-form';
import { LessonPlanForm } from './lesson-plan-form';

interface LessonData {
  id: string;
  title: string;
  topic: string;
  description: string | null;
  scheduledAt: string;
  duration: number;
  status: string;
  teacherNotes: string | null;
  startedAt: string | null;
  completedAt: string | null;
  class: { id: string; name: string; subject: string; gradeYear: string };
  teacher: {
    user: { firstName: string; lastName: string; avatar: string | null };
  };
  _count: { homeworks: number; quizzes: number };
}

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  SCHEDULED: 'outline',
  IN_PROGRESS: 'secondary',
  COMPLETED: 'default',
  CANCELLED: 'destructive',
};

type Tab = 'details' | 'attendance' | 'plan';

export function LessonDetail({ lessonId }: { lessonId: string }) {
  const router = useRouter();
  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('details');
  const [actionLoading, setActionLoading] = useState(false);

  async function fetchLesson() {
    setIsLoading(true);
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

  useEffect(() => {
    fetchLesson();
  }, [lessonId]);

  async function handleStart() {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/lessons/${lessonId}/start`, { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        toast.success('Lesson started!');
        fetchLesson();
      } else {
        toast.error(json.message || 'Failed to start lesson');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleCancel() {
    if (!confirm('Are you sure you want to cancel this lesson?')) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/lessons/${lessonId}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        toast.success('Lesson cancelled');
        router.push(`/t/classes/${lesson?.class.id}`);
      } else {
        toast.error(json.message || 'Failed to cancel lesson');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setActionLoading(false);
    }
  }

  if (isLoading || !lesson) {
    return (
      <div className="container py-8">
        <p className="text-center text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'details', label: 'Details' },
    { key: 'attendance', label: 'Attendance' },
    { key: 'plan', label: 'Lesson Plan' },
  ];

  return (
    <div className="container py-8">
      <Link
        href={`/t/classes/${lesson.class.id}`}
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to {lesson.class.name}
      </Link>

      <div className="mb-6 flex items-start justify-between">
        <div>
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

        <div className="flex gap-2">
          {lesson.status === 'SCHEDULED' && (
            <>
              <Button onClick={handleStart} disabled={actionLoading}>
                {actionLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Play className="mr-2 h-4 w-4" />
                )}
                Start Lesson
              </Button>
              <Button variant="destructive" onClick={handleCancel} disabled={actionLoading}>
                <XCircle className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </>
          )}
          {lesson.status === 'IN_PROGRESS' && (
            <Button
              onClick={() => setActiveTab('attendance')}
              variant="default"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Complete Lesson
            </Button>
          )}
        </div>
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

      {activeTab === 'details' && <DetailsSection lesson={lesson} />}
      {activeTab === 'attendance' && (
        <AttendanceForm lessonId={lessonId} status={lesson.status} onCompleted={fetchLesson} />
      )}
      {activeTab === 'plan' && (
        <LessonPlanForm
          lessonId={lessonId}
          subject={lesson.class.subject}
          gradeYear={lesson.class.gradeYear}
          topic={lesson.topic}
          duration={lesson.duration}
        />
      )}
    </div>
  );
}

function DetailsSection({ lesson }: { lesson: LessonData }) {
  return (
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

      {lesson.teacherNotes && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Teacher Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{lesson.teacherNotes}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Duration</p>
            <p className="text-xl font-semibold">{lesson.duration} minutes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Homeworks</p>
            <p className="text-xl font-semibold">{lesson._count.homeworks}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Quizzes</p>
            <p className="text-xl font-semibold">{lesson._count.quizzes}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
