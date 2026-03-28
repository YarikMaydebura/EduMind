'use client';

import {
  AlertCircle,
  BookOpen,
  Brain,
  ChevronRight,
  Clock,
  FileText,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { MotionItem, MotionList } from '@/components/motion/motion-list';
import { MotionPage } from '@/components/motion/motion-page';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DashboardData {
  stats: {
    totalClasses: number;
    totalStudents: number;
    ungradedCount: number;
    totalHomeworks: number;
    totalQuizzes: number;
    totalLessons: number;
  };
  classes: Array<{
    id: string;
    name: string;
    subject: string;
    studentCount: number;
  }>;
  upcomingLessons: Array<{
    id: string;
    title: string;
    topic: string;
    scheduledAt: string;
    duration: number;
    className: string;
    classSubject: string;
  }>;
  ungradedSubmissions: Array<{
    homeworkId: string;
    homeworkTitle: string;
    classId: string;
    studentId: string;
    studentName: string;
    submittedAt: string;
  }>;
  recentQuizResults: Array<{
    quizTitle: string;
    studentName: string;
    score: number;
    percentage: number;
    completedAt: string | null;
  }>;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function TeacherDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/teacher/dashboard');
        const json = await res.json();
        if (json.success) setData(json.data);
        else toast.error('Failed to load dashboard');
      } catch {
        toast.error('Failed to load dashboard');
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  if (isLoading || !data) {
    return (
      <div className="container py-8">
        <div className="mb-6 h-9 w-64 animate-pulse rounded bg-muted" />
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-lg border bg-card" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-64 animate-pulse rounded-lg border bg-card" />
          <div className="h-64 animate-pulse rounded-lg border bg-card" />
        </div>
      </div>
    );
  }

  const { stats } = data;

  return (
    <MotionPage className="container py-8">
      <h1 className="mb-6 text-3xl font-bold">{getGreeting()}!</h1>

      {/* Stats grid */}
      <MotionList className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <MotionItem>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-blue-500" />
                <p className="text-sm text-muted-foreground">Classes</p>
              </div>
              <p className="mt-1 text-2xl font-bold">{stats.totalClasses}</p>
            </CardContent>
          </Card>
        </MotionItem>
        <MotionItem>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-green-500" />
                <p className="text-sm text-muted-foreground">Students</p>
              </div>
              <p className="mt-1 text-2xl font-bold">{stats.totalStudents}</p>
            </CardContent>
          </Card>
        </MotionItem>
        <MotionItem>
          <Card
            className={
              stats.ungradedCount > 0 ? 'border-orange-500/50 bg-orange-500/5' : ''
            }
          >
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <AlertCircle
                  className={`h-4 w-4 ${stats.ungradedCount > 0 ? 'text-orange-500' : 'text-muted-foreground'}`}
                />
                <p className="text-sm text-muted-foreground">Ungraded</p>
              </div>
              <p className="mt-1 text-2xl font-bold">{stats.ungradedCount}</p>
            </CardContent>
          </Card>
        </MotionItem>
        <MotionItem>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-purple-500" />
                <p className="text-sm text-muted-foreground">Homeworks</p>
              </div>
              <p className="mt-1 text-2xl font-bold">{stats.totalHomeworks}</p>
            </CardContent>
          </Card>
        </MotionItem>
        <MotionItem>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-pink-500" />
                <p className="text-sm text-muted-foreground">Quizzes</p>
              </div>
              <p className="mt-1 text-2xl font-bold">{stats.totalQuizzes}</p>
            </CardContent>
          </Card>
        </MotionItem>
      </MotionList>

      {/* Two columns: Upcoming Lessons + Needs Grading */}
      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        {/* Upcoming Lessons */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Clock className="h-4 w-4" />
              Upcoming Lessons
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.upcomingLessons.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No upcoming lessons this week
              </p>
            ) : (
              <div className="space-y-3">
                {data.upcomingLessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{lesson.title}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {lesson.className}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(lesson.scheduledAt)}
                        </span>
                      </div>
                    </div>
                    <Link href={`/t/lessons/${lesson.id}`}>
                      <Button variant="ghost" size="icon" className="shrink-0">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Needs Grading */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <AlertCircle className="h-4 w-4" />
              Needs Grading
              {stats.ungradedCount > 0 && (
                <Badge variant="destructive" className="ml-auto">
                  {stats.ungradedCount}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.ungradedSubmissions.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                All caught up! No submissions to grade.
              </p>
            ) : (
              <div className="space-y-3">
                {data.ungradedSubmissions.map((sub) => (
                  <div
                    key={`${sub.homeworkId}-${sub.studentId}`}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{sub.studentName}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="truncate text-xs text-muted-foreground">
                          {sub.homeworkTitle}
                        </span>
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {timeAgo(sub.submittedAt)}
                        </span>
                      </div>
                    </div>
                    <Link href={`/t/homeworks/${sub.homeworkId}/grade/${sub.studentId}`}>
                      <Button variant="outline" size="sm" className="shrink-0">
                        Grade
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Quiz Activity */}
      {data.recentQuizResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Brain className="h-4 w-4" />
              Recent Quiz Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.recentQuizResults.map((result, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{result.studentName}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {result.quizTitle}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{Math.round(result.percentage)}%</p>
                    {result.completedAt && (
                      <p className="text-xs text-muted-foreground">
                        {timeAgo(result.completedAt)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </MotionPage>
  );
}
