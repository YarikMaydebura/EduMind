'use client';

import { ArrowLeft, BookOpen, Brain, CalendarDays, ClipboardList, Crown, GraduationCap, Medal, Star, Trophy } from 'lucide-react';
import Link from 'next/link';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

import { StudentHomeworks } from './student-homeworks';
import { StudentLessons } from './student-lessons';
import { StudentQuizzes } from './student-quizzes';

interface ClassInfo {
  id: string;
  name: string;
  subject: string;
  gradeYear: string;
  description: string | null;
  teacherName: string;
}

interface Profile {
  classXp: number;
  classLevel: number;
  classGrade: string;
  averageScore: number | null;
  lessonsCompleted: number;
  homeworkCompleted: number;
  quizzesCompleted: number;
}

interface MiniLeaderboardEntry {
  rank: number;
  studentId: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
  level: number;
  classXp: number;
  isCurrentUser: boolean;
}

interface Props {
  classInfo: ClassInfo;
  profile: Profile | null;
  miniLeaderboard: MiniLeaderboardEntry[];
}

export function StudentClassDetail({ classInfo, profile, miniLeaderboard }: Props) {
  const stats = profile || {
    classXp: 0,
    classLevel: 1,
    classGrade: 'E',
    averageScore: null,
    lessonsCompleted: 0,
    homeworkCompleted: 0,
    quizzesCompleted: 0,
  };

  return (
    <div className="container py-8">
      <Link
        href="/s/classes"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to classes
      </Link>

      <div className="mb-6">
        <h1 className="text-3xl font-bold">{classInfo.name}</h1>
        <div className="mt-2 flex items-center gap-3">
          <Badge variant="secondary">{classInfo.subject.replace(/_/g, ' ')}</Badge>
          <Badge variant="outline">
            {classInfo.gradeYear.replace('GRADE_', 'Grade ').replace('UNIVERSITY_', 'Uni ')}
          </Badge>
          <span className="text-sm text-muted-foreground">by {classInfo.teacherName}</span>
        </div>
        {classInfo.description && (
          <p className="mt-3 text-muted-foreground">{classInfo.description}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Star className="h-4 w-4" />
              Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.classLevel}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Trophy className="h-4 w-4" />
              Grade
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.classGrade}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <GraduationCap className="h-4 w-4" />
              XP
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.classXp}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <BookOpen className="h-4 w-4" />
              Avg Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {stats.averageScore !== null ? `${Math.round(stats.averageScore)}%` : '—'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Lessons Completed</p>
            <p className="text-xl font-semibold">{stats.lessonsCompleted}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Homework Completed</p>
            <p className="text-xl font-semibold">{stats.homeworkCompleted}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Quizzes Completed</p>
            <p className="text-xl font-semibold">{stats.quizzesCompleted}</p>
          </CardContent>
        </Card>
      </div>

      {miniLeaderboard.length > 0 && (
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Trophy className="h-4 w-4" />
                Top Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {miniLeaderboard.map((entry) => (
                  <div
                    key={entry.studentId}
                    className={cn(
                      'flex items-center gap-3 rounded-lg border p-2.5',
                      entry.isCurrentUser && 'border-primary bg-primary/5',
                    )}
                  >
                    <div className="flex w-6 items-center justify-center">
                      {entry.rank === 1 ? (
                        <Crown className="h-4 w-4 text-yellow-500" />
                      ) : entry.rank === 2 ? (
                        <Medal className="h-4 w-4 text-gray-400" />
                      ) : entry.rank === 3 ? (
                        <Medal className="h-4 w-4 text-amber-700" />
                      ) : (
                        <span className="text-xs font-medium text-muted-foreground">
                          {entry.rank}
                        </span>
                      )}
                    </div>
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={entry.avatar ?? undefined} />
                      <AvatarFallback className="text-xs">
                        {entry.firstName[0]}
                        {entry.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {entry.firstName} {entry.lastName}
                        {entry.isCurrentUser && (
                          <span className="ml-1 text-xs text-muted-foreground">(you)</span>
                        )}
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      Lv.{entry.level}
                    </Badge>
                    <span className="text-sm font-semibold text-yellow-600">
                      {entry.classXp.toLocaleString()} XP
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="mt-6">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
          <CalendarDays className="h-5 w-5" />
          Lessons
        </h2>
        <StudentLessons classId={classInfo.id} />
      </div>

      <div className="mt-6">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
          <ClipboardList className="h-5 w-5" />
          Homeworks
        </h2>
        <StudentHomeworks classId={classInfo.id} />
      </div>

      <div className="mt-6">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
          <Brain className="h-5 w-5" />
          Quizzes
        </h2>
        <StudentQuizzes classId={classInfo.id} />
      </div>
    </div>
  );
}
