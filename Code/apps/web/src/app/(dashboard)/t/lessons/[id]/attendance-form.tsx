'use client';

import { CheckCircle, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface StudentEntry {
  studentId: string;
  firstName: string;
  lastName: string;
  present: boolean;
  participationScore: number;
  notes: string;
}

interface AttendanceRecord {
  studentId: string;
  present: boolean;
  participationScore: number | null;
  notes: string | null;
}

interface Props {
  lessonId: string;
  status: string;
  onCompleted: () => void;
}

export function AttendanceForm({ lessonId, status, onCompleted }: Props) {
  const [students, setStudents] = useState<StudentEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [teacherNotes, setTeacherNotes] = useState('');

  useEffect(() => {
    async function fetchAttendance() {
      try {
        const res = await fetch(`/api/lessons/${lessonId}/attendance`);
        const json = await res.json();
        if (!json.success) return;

        const { attendance, students: roster } = json.data;

        if (status === 'COMPLETED') {
          // Build name lookup from roster then enrich attendance records
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const studentMap = new Map<string, any>(roster.map((s: any) => [s.id, s]));
          setStudents(
            attendance.map((a: AttendanceRecord) => {
              const s = studentMap.get(a.studentId);
              return {
                studentId: a.studentId,
                firstName: s?.firstName ?? 'Unknown',
                lastName: s?.lastName ?? '',
                present: a.present,
                participationScore: a.participationScore ?? 0,
                notes: a.notes || '',
              };
            }),
          );
        } else {
          // Build editable list from roster
          const existingMap = new Map<string, AttendanceRecord>();
          for (const a of attendance) {
            existingMap.set(a.studentId, a);
          }

          setStudents(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            roster.map((s: any) => {
              const existing = existingMap.get(s.id);
              return {
                studentId: s.id,
                firstName: s.firstName,
                lastName: s.lastName,
                present: existing?.present ?? true,
                participationScore: existing?.participationScore ?? 0,
                notes: existing?.notes ?? '',
              };
            }),
          );
        }
      } catch {
        toast.error('Failed to load attendance');
      } finally {
        setIsLoading(false);
      }
    }

    fetchAttendance();
  }, [lessonId, status]);

  function togglePresent(index: number) {
    setStudents((prev) =>
      prev.map((s, i) => (i === index ? { ...s, present: !s.present } : s)),
    );
  }

  function toggleAll(present: boolean) {
    setStudents((prev) => prev.map((s) => ({ ...s, present })));
  }

  function updateParticipation(index: number, score: number) {
    setStudents((prev) =>
      prev.map((s, i) => (i === index ? { ...s, participationScore: score } : s)),
    );
  }

  function updateNotes(index: number, notes: string) {
    setStudents((prev) =>
      prev.map((s, i) => (i === index ? { ...s, notes } : s)),
    );
  }

  async function handleComplete() {
    if (!confirm('Complete this lesson and award XP? This cannot be undone.')) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/lessons/${lessonId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attendance: students.map((s) => ({
            studentId: s.studentId,
            present: s.present,
            participationScore: s.participationScore || undefined,
            notes: s.notes || undefined,
          })),
          teacherNotes: teacherNotes || undefined,
        }),
      });

      const json = await res.json();
      if (json.success) {
        toast.success('Lesson completed! XP awarded.');
        onCompleted();
      } else {
        toast.error(json.message || 'Failed to complete lesson');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return <p className="py-8 text-center text-muted-foreground">Loading attendance...</p>;
  }

  const isEditable = status === 'IN_PROGRESS';
  const allPresent = students.length > 0 && students.every((s) => s.present);

  return (
    <div className="space-y-4">
      {isEditable && (
        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={() => toggleAll(!allPresent)}>
            {allPresent ? 'Unmark All' : 'Mark All Present'}
          </Button>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Attendance ({students.filter((s) => s.present).length}/{students.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {students.length === 0 ? (
            <p className="py-4 text-center text-muted-foreground">No students enrolled</p>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead className="w-[100px]">Present</TableHead>
                    <TableHead className="w-[120px]">Participation</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student, i) => (
                    <TableRow key={student.studentId}>
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
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={student.present}
                          onChange={() => togglePresent(i)}
                          disabled={!isEditable}
                          className="h-4 w-4"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min={0}
                          max={10}
                          value={student.participationScore}
                          onChange={(e) => updateParticipation(i, Number(e.target.value))}
                          disabled={!isEditable}
                          className="h-8 w-20"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={student.notes}
                          onChange={(e) => updateNotes(i, e.target.value)}
                          disabled={!isEditable}
                          placeholder="Optional notes"
                          className="h-8"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {isEditable && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Teacher Notes (optional)</CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              value={teacherNotes}
              onChange={(e) => setTeacherNotes(e.target.value)}
              placeholder="Any notes about the lesson..."
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              rows={3}
            />
          </CardContent>
        </Card>
      )}

      {isEditable && students.length > 0 && (
        <Button onClick={handleComplete} disabled={isSubmitting} className="w-full">
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <CheckCircle className="mr-2 h-4 w-4" />
          )}
          Complete Lesson & Award XP
        </Button>
      )}
    </div>
  );
}
