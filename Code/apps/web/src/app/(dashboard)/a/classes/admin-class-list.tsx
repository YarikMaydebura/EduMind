'use client';

import { BookOpen, Search, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface ClassItem {
  id: string;
  name: string;
  subject: string;
  gradeYear: string;
  description: string | null;
  lessonsPerWeek: number;
  studentsCount: number;
  teacherName: string;
  isArchived: boolean;
}

export function AdminClassList() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [search, setSearch] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  async function fetchClasses() {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (showArchived) params.set('archived', 'true');

      const res = await fetch(`/api/classes?${params}`);
      const json = await res.json();
      if (json.success) setClasses(json.data);
    } catch {
      toast.error('Failed to load classes');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchClasses();
  }, [showArchived]);

  useEffect(() => {
    const timer = setTimeout(fetchClasses, 300);
    return () => clearTimeout(timer);
  }, [search]);

  function formatSubject(subject: string) {
    return subject.replace(/_/g, ' ');
  }

  function formatGradeYear(gradeYear: string) {
    return gradeYear.replace('GRADE_', 'Grade ').replace('UNIVERSITY_', 'Uni ');
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search classes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant={showArchived ? 'default' : 'outline'}
          size="sm"
          onClick={() => setShowArchived(!showArchived)}
        >
          Archived
        </Button>
      </div>

      {isLoading ? (
        <p className="py-8 text-center text-muted-foreground">Loading...</p>
      ) : classes.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-lg font-medium">No classes found</p>
            <p className="text-muted-foreground">Classes will appear here once teachers create them</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {classes.map((cls) => (
            <Card key={cls.id}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{cls.name}</CardTitle>
                <div className="flex gap-2">
                  <Badge variant="secondary">{formatSubject(cls.subject)}</Badge>
                  <Badge variant="outline">{formatGradeYear(cls.gradeYear)}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-2 text-sm font-medium">{cls.teacherName}</p>
                {cls.description && (
                  <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
                    {cls.description}
                  </p>
                )}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {cls.studentsCount} students
                  </span>
                  <span>{cls.lessonsPerWeek} lessons/week</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
