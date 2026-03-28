'use client';

import {
  BookOpen,
  Brain,
  Building2,
  FileText,
  GraduationCap,
  Settings,
  UserPlus,
  Users,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { MotionItem, MotionList } from '@/components/motion/motion-list';
import { MotionPage } from '@/components/motion/motion-page';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface DashboardData {
  tenant: {
    name: string;
    plan: string;
    maxStudents: number;
    maxTeachers: number;
    aiRequestsUsed: number;
    aiRequestsLimit: number;
    trialEndsAt: string | null;
    subscriptionEndsAt: string | null;
  } | null;
  userCounts: {
    total: number;
    teachers: number;
    students: number;
    parents: number;
  };
  classCounts: {
    active: number;
    archived: number;
  };
  contentStats: {
    lessons: number;
    homeworks: number;
    quizzes: number;
  };
  recentUsers: Array<{
    id: string;
    name: string;
    role: string;
    email: string;
    lastActiveAt: string | null;
    avatar: string | null;
  }>;
  pendingInvites: number;
}

function formatPlan(plan: string): string {
  return plan
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function roleColor(role: string): 'default' | 'secondary' | 'outline' {
  switch (role) {
    case 'TEACHER':
      return 'default';
    case 'STUDENT':
      return 'secondary';
    default:
      return 'outline';
  }
}

export function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/admin/dashboard');
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
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-lg border bg-card" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-64 animate-pulse rounded-lg border bg-card" />
          <div className="h-64 animate-pulse rounded-lg border bg-card" />
        </div>
      </div>
    );
  }

  const { tenant, userCounts, classCounts, contentStats, recentUsers, pendingInvites } =
    data;

  return (
    <MotionPage className="container py-8">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <Building2 className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">{tenant?.name ?? 'Dashboard'}</h1>
          {tenant && (
            <div className="mt-1 flex items-center gap-2">
              <Badge variant="secondary">{formatPlan(tenant.plan)}</Badge>
            </div>
          )}
        </div>
      </div>

      {/* Capacity cards */}
      {tenant && (
        <MotionList className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MotionItem>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-blue-500" />
                    <p className="text-sm text-muted-foreground">Teachers</p>
                  </div>
                  <span className="text-sm font-medium">
                    {userCounts.teachers} / {tenant.maxTeachers}
                  </span>
                </div>
                <Progress
                  value={userCounts.teachers}
                  max={tenant.maxTeachers}
                  className="mt-3"
                />
              </CardContent>
            </Card>
          </MotionItem>
          <MotionItem>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-green-500" />
                    <p className="text-sm text-muted-foreground">Students</p>
                  </div>
                  <span className="text-sm font-medium">
                    {userCounts.students} / {tenant.maxStudents}
                  </span>
                </div>
                <Progress
                  value={userCounts.students}
                  max={tenant.maxStudents}
                  className="mt-3"
                />
              </CardContent>
            </Card>
          </MotionItem>
          <MotionItem>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-purple-500" />
                  <p className="text-sm text-muted-foreground">Active Classes</p>
                </div>
                <p className="mt-2 text-2xl font-bold">{classCounts.active}</p>
                {classCounts.archived > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {classCounts.archived} archived
                  </p>
                )}
              </CardContent>
            </Card>
          </MotionItem>
          <MotionItem>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    <p className="text-sm text-muted-foreground">AI Usage</p>
                  </div>
                  <span className="text-sm font-medium">
                    {tenant.aiRequestsUsed} / {tenant.aiRequestsLimit}
                  </span>
                </div>
                <Progress
                  value={tenant.aiRequestsUsed}
                  max={tenant.aiRequestsLimit}
                  className="mt-3"
                />
              </CardContent>
            </Card>
          </MotionItem>
        </MotionList>
      )}

      {/* Content stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Total Users</p>
            </div>
            <p className="mt-1 text-2xl font-bold">{userCounts.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Lessons</p>
            </div>
            <p className="mt-1 text-2xl font-bold">{contentStats.lessons}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Homeworks</p>
            </div>
            <p className="mt-1 text-2xl font-bold">{contentStats.homeworks}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Quizzes</p>
            </div>
            <p className="mt-1 text-2xl font-bold">{contentStats.quizzes}</p>
          </CardContent>
        </Card>
      </div>

      {/* Two columns: Recent Users + Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recently Active Users */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Users className="h-4 w-4" />
              Recently Active Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentUsers.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No recent activity
              </p>
            ) : (
              <div className="space-y-3">
                {recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center gap-3 rounded-lg border p-3">
                    <Avatar className="h-8 w-8">
                      {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
                      <AvatarFallback className="text-xs">
                        {user.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{user.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge variant={roleColor(user.role)} className="text-xs">
                        {user.role.replace(/_/g, ' ')}
                      </Badge>
                      {user.lastActiveAt && (
                        <span className="text-xs text-muted-foreground">
                          {timeAgo(user.lastActiveAt)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Settings className="h-4 w-4" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              <Link href="/a/users">
                <Card className="cursor-pointer transition-colors hover:border-primary/50">
                  <CardContent className="flex items-center gap-3 p-4">
                    <Users className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Manage Users</p>
                      <p className="text-xs text-muted-foreground">
                        {userCounts.total} users
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/a/classes">
                <Card className="cursor-pointer transition-colors hover:border-primary/50">
                  <CardContent className="flex items-center gap-3 p-4">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Manage Classes</p>
                      <p className="text-xs text-muted-foreground">
                        {classCounts.active} active
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/a/invites">
                <Card className="cursor-pointer transition-colors hover:border-primary/50">
                  <CardContent className="flex items-center gap-3 p-4">
                    <UserPlus className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Invites</p>
                      <p className="text-xs text-muted-foreground">
                        {pendingInvites} pending
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/a/settings">
                <Card className="cursor-pointer transition-colors hover:border-primary/50">
                  <CardContent className="flex items-center gap-3 p-4">
                    <Settings className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">School Settings</p>
                      <p className="text-xs text-muted-foreground">Plan & billing</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </MotionPage>
  );
}
