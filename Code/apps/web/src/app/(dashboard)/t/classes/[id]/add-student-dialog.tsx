'use client';

import { Loader2, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface Student {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classId: string;
  onAdded: () => void;
}

export function AddStudentDialog({ open, onOpenChange, classId, onAdded }: Props) {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [enrollingId, setEnrollingId] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({ role: 'STUDENT' });
        if (search) params.set('search', search);

        const res = await fetch(`/api/users?${params}`);
        const json = await res.json();
        if (json.success) setStudents(json.data);
      } catch {
        toast.error('Failed to load students');
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [open, search]);

  async function enrollStudent(userId: string) {
    setEnrollingId(userId);
    try {
      // Need to look up the student profile id from the user id
      // The students API returns user data, but enrollment needs student profile id
      // First get the student profile
      const userRes = await fetch(`/api/users/${userId}`);
      const userJson = await userRes.json();

      if (!userJson.success || !userJson.data.student) {
        toast.error('Student profile not found');
        return;
      }

      const res = await fetch(`/api/classes/${classId}/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: userJson.data.student.id }),
      });

      const json = await res.json();
      if (json.success) {
        toast.success('Student enrolled!');
        onAdded();
        onOpenChange(false);
      } else {
        toast.error(json.message || 'Failed to enroll student');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setEnrollingId(null);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Student</DialogTitle>
          <DialogDescription>Search and enroll an existing student</DialogDescription>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="max-h-64 space-y-1 overflow-y-auto">
          {isLoading ? (
            <p className="py-4 text-center text-sm text-muted-foreground">Loading...</p>
          ) : students.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">No students found</p>
          ) : (
            students.map((student) => (
              <div
                key={student.id}
                className="flex items-center justify-between rounded-md p-2 hover:bg-accent"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      {student.firstName[0]}
                      {student.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">
                      {student.firstName} {student.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">{student.email}</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={enrollingId === student.id}
                  onClick={() => enrollStudent(student.id)}
                >
                  {enrollingId === student.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Add'
                  )}
                </Button>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
