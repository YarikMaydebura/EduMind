'use client';

import { ArrowLeft, BookOpen, Brain, CalendarDays, ClipboardList, Loader2, MoreHorizontal, Settings, UserPlus, Users } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { AddStudentDialog } from './add-student-dialog';
import { HomeworksTab } from './homeworks-tab';
import { InviteStudentDialog } from './invite-student-dialog';
import { LessonsTab } from './lessons-tab';
import { QuizzesTab } from './quizzes-tab';

interface ClassData {
  id: string;
  name: string;
  subject: string;
  gradeYear: string;
  description: string | null;
  lessonsPerWeek: number;
  defaultDuration: number;
  isArchived: boolean;
  _count: { lessons: number; homeworks: number; quizzes: number };
  teacher: {
    id: string;
    user: { firstName: string; lastName: string; avatar: string | null };
  };
  enrollments: Array<{
    student: {
      id: string;
      user: { id: string; firstName: string; lastName: string; avatar: string | null };
      classProfiles: Array<{
        classXp: number;
        classLevel: number;
        classGrade: string;
        averageScore: number | null;
      }>;
    };
  }>;
}

type Tab = 'overview' | 'students' | 'lessons' | 'homeworks' | 'quizzes' | 'settings';

export function ClassDetail({ classId }: { classId: string }) {
  const router = useRouter();
  const [classData, setClassData] = useState<ClassData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [inviteOpen, setInviteOpen] = useState(false);
  const [addStudentOpen, setAddStudentOpen] = useState(false);

  async function fetchClass() {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/classes/${classId}`);
      const json = await res.json();
      if (json.success) setClassData(json.data);
    } catch {
      toast.error('Failed to load class');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchClass();
  }, [classId]);

  async function removeStudent(studentId: string) {
    try {
      const res = await fetch(`/api/classes/${classId}/students/${studentId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        toast.success('Student removed');
        fetchClass();
      }
    } catch {
      toast.error('Failed to remove student');
    }
  }

  if (isLoading || !classData) {
    return (
      <div className="container py-8">
        <p className="text-center text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const students = classData.enrollments.map((e) => ({
    id: e.student.id,
    firstName: e.student.user.firstName,
    lastName: e.student.user.lastName,
    avatar: e.student.user.avatar,
    ...(e.student.classProfiles[0] || {
      classXp: 0,
      classLevel: 1,
      classGrade: 'E',
      averageScore: null,
    }),
  }));

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'overview', label: 'Overview', icon: <BookOpen className="h-4 w-4" /> },
    { key: 'students', label: 'Students', icon: <Users className="h-4 w-4" /> },
    { key: 'lessons', label: 'Lessons', icon: <CalendarDays className="h-4 w-4" /> },
    { key: 'homeworks', label: 'Homeworks', icon: <ClipboardList className="h-4 w-4" /> },
    { key: 'quizzes', label: 'Quizzes', icon: <Brain className="h-4 w-4" /> },
    { key: 'settings', label: 'Settings', icon: <Settings className="h-4 w-4" /> },
  ];

  return (
    <div className="container py-8">
      <div className="mb-6">
        <Link href="/t/classes" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Back to classes
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{classData.name}</h1>
            <div className="mt-2 flex gap-2">
              <Badge variant="secondary">{classData.subject.replace(/_/g, ' ')}</Badge>
              <Badge variant="outline">
                {classData.gradeYear.replace('GRADE_', 'Grade ').replace('UNIVERSITY_', 'Uni ')}
              </Badge>
              {classData.isArchived && <Badge variant="destructive">Archived</Badge>}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 flex gap-1 rounded-lg border p-1">
        {tabs.map((tab) => (
          <Button
            key={tab.key}
            variant={activeTab === tab.key ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab(tab.key)}
            className="gap-2"
          >
            {tab.icon}
            {tab.label}
          </Button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <OverviewTab classData={classData} studentsCount={students.length} />
      )}
      {activeTab === 'lessons' && <LessonsTab classId={classId} />}
      {activeTab === 'homeworks' && <HomeworksTab classId={classId} />}
      {activeTab === 'quizzes' && <QuizzesTab classId={classId} />}
      {activeTab === 'students' && (
        <StudentsTab
          students={students}
          onRemove={removeStudent}
          onInvite={() => setInviteOpen(true)}
          onAdd={() => setAddStudentOpen(true)}
        />
      )}
      {activeTab === 'settings' && (
        <SettingsTab classData={classData} onUpdated={fetchClass} />
      )}

      <InviteStudentDialog
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        classId={classId}
      />
      <AddStudentDialog
        open={addStudentOpen}
        onOpenChange={setAddStudentOpen}
        classId={classId}
        onAdded={fetchClass}
      />
    </div>
  );
}

function OverviewTab({
  classData,
  studentsCount,
}: {
  classData: ClassData;
  studentsCount: number;
}) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Students</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{studentsCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Lessons</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{classData._count.lessons}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Homeworks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{classData._count.homeworks}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Quizzes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{classData._count.quizzes}</p>
          </CardContent>
        </Card>
      </div>

      {classData.description && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{classData.description}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            {classData.lessonsPerWeek} lessons per week, {classData.defaultDuration} minutes each
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function StudentsTab({
  students,
  onRemove,
  onInvite,
  onAdd,
}: {
  students: Array<{
    id: string;
    firstName: string;
    lastName: string;
    avatar: string | null;
    classXp: number;
    classLevel: number;
    classGrade: string;
    averageScore: number | null;
  }>;
  onRemove: (id: string) => void;
  onInvite: () => void;
  onAdd: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end gap-2">
        <Button variant="outline" onClick={onAdd}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Student
        </Button>
        <Button onClick={onInvite}>
          <ClipboardList className="mr-2 h-4 w-4" />
          Invite Students
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Grade</TableHead>
              <TableHead>XP</TableHead>
              <TableHead>Avg Score</TableHead>
              <TableHead className="w-[50px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                  No students enrolled yet
                </TableCell>
              </TableRow>
            ) : (
              students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {student.firstName[0]}
                          {student.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">
                        {student.firstName} {student.lastName}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{student.classLevel}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{student.classGrade}</Badge>
                  </TableCell>
                  <TableCell>{student.classXp}</TableCell>
                  <TableCell>
                    {student.averageScore !== null
                      ? `${Math.round(student.averageScore)}%`
                      : '—'}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => onRemove(student.id)}
                        >
                          Remove from class
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function SettingsTab({
  classData,
  onUpdated,
}: {
  classData: ClassData;
  onUpdated: () => void;
}) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: classData.name,
      description: classData.description || '',
      lessonsPerWeek: classData.lessonsPerWeek,
      defaultDuration: classData.defaultDuration,
    },
  });

  async function onSubmit(data: Record<string, unknown>) {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/classes/${classData.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          lessonsPerWeek: Number(data.lessonsPerWeek),
          defaultDuration: Number(data.defaultDuration),
        }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success('Settings saved');
        onUpdated();
      } else {
        toast.error(json.message || 'Failed to save');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleArchive() {
    if (!confirm(`Are you sure you want to ${classData.isArchived ? 'unarchive' : 'archive'} this class?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/classes/${classData.id}`, {
        method: classData.isArchived ? 'PATCH' : 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: classData.isArchived ? JSON.stringify({ isArchived: false }) : undefined,
      });

      if (res.ok) {
        toast.success(classData.isArchived ? 'Class unarchived' : 'Class archived');
        if (!classData.isArchived) {
          router.push('/t/classes');
        } else {
          onUpdated();
        }
      }
    } catch {
      toast.error('Something went wrong');
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Class Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Class Name</Label>
            <Input id="name" {...register('name')} disabled={isSaving} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input id="description" {...register('description')} disabled={isSaving} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lessonsPerWeek">Lessons per Week</Label>
              <Input
                id="lessonsPerWeek"
                type="number"
                min={1}
                max={10}
                {...register('lessonsPerWeek')}
                disabled={isSaving}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="defaultDuration">Duration (min)</Label>
              <Input
                id="defaultDuration"
                type="number"
                min={15}
                max={180}
                {...register('defaultDuration')}
                disabled={isSaving}
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <Button type="submit" disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>

            <Button type="button" variant="destructive" onClick={handleArchive}>
              {classData.isArchived ? 'Unarchive Class' : 'Archive Class'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
