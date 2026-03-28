'use client';

import { BookOpen, Users } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ClassItem {
  id: string;
  name: string;
  subject: string;
  gradeYear: string;
  description: string | null;
  studentsCount: number;
  teacherName: string;
}

export function StudentClassList() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchClasses() {
      try {
        const res = await fetch('/api/classes');
        const json = await res.json();
        if (json.success) setClasses(json.data);
      } catch {
        toast.error('Failed to load classes');
      } finally {
        setIsLoading(false);
      }
    }
    fetchClasses();
  }, []);

  if (isLoading) {
    return <p className="py-8 text-center text-muted-foreground">Loading...</p>;
  }

  if (classes.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <BookOpen className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <p className="text-lg font-medium">No classes yet</p>
          <p className="text-muted-foreground">
            You&apos;ll see your classes here once you&apos;re enrolled
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {classes.map((cls) => (
        <Link key={cls.id} href={`/s/classes/${cls.id}`}>
          <Card className="transition-colors hover:border-primary">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{cls.name}</CardTitle>
              <div className="flex gap-2">
                <Badge variant="secondary">{cls.subject.replace(/_/g, ' ')}</Badge>
                <Badge variant="outline">
                  {cls.gradeYear.replace('GRADE_', 'Grade ').replace('UNIVERSITY_', 'Uni ')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-2 text-sm font-medium">{cls.teacherName}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {cls.studentsCount} students
                </span>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
