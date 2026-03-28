'use client';

import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const SUBJECTS = [
  'MATHEMATICS', 'ENGLISH', 'PHYSICS', 'CHEMISTRY', 'BIOLOGY',
  'COMPUTER_SCIENCE', 'HISTORY', 'GEOGRAPHY', 'ECONOMICS', 'PSYCHOLOGY',
  'SOCIOLOGY', 'GERMAN', 'FRENCH', 'SPANISH', 'JAPANESE', 'CHINESE',
  'RUSSIAN', 'LATIN', 'UKRAINIAN', 'DUTCH', 'ART', 'MUSIC', 'DRAMA',
  'DANCE', 'PHOTOGRAPHY', 'ENGINEERING', 'ROBOTICS', 'WEB_DEVELOPMENT',
  'APP_DEVELOPMENT', 'DATA_SCIENCE', 'ACCOUNTING', 'MARKETING',
  'ENTREPRENEURSHIP', 'PHYSICAL_EDUCATION', 'HEALTH', 'PHILOSOPHY',
  'RELIGIOUS_STUDIES',
];

const GRADE_YEARS = [
  'GRADE_1', 'GRADE_2', 'GRADE_3', 'GRADE_4', 'GRADE_5', 'GRADE_6',
  'GRADE_7', 'GRADE_8', 'GRADE_9', 'GRADE_10', 'GRADE_11', 'GRADE_12',
  'UNIVERSITY_1', 'UNIVERSITY_2', 'UNIVERSITY_3', 'UNIVERSITY_4', 'ADULT',
];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: () => void;
}

export function CreateClassDialog({ open, onOpenChange, onCreated }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, setValue, reset } = useForm({
    defaultValues: {
      name: '',
      subject: '',
      gradeYear: '',
      description: '',
      lessonsPerWeek: 2,
      defaultDuration: 45,
    },
  });

  async function onSubmit(data: Record<string, unknown>) {
    setIsLoading(true);
    try {
      const res = await fetch('/api/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          lessonsPerWeek: Number(data.lessonsPerWeek),
          defaultDuration: Number(data.defaultDuration),
        }),
      });

      const json = await res.json();
      if (!json.success) {
        toast.error(json.message || 'Failed to create class');
        return;
      }

      toast.success('Class created!');
      reset();
      onOpenChange(false);
      onCreated();
    } catch {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }

  function formatLabel(value: string) {
    return value.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Class</DialogTitle>
          <DialogDescription>Set up a new class for your students</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Class Name</Label>
            <Input
              id="name"
              placeholder="e.g. Mathematics 8A"
              {...register('name')}
              disabled={isLoading}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Subject</Label>
              <Select onValueChange={(v) => setValue('subject', v)} disabled={isLoading}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {SUBJECTS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {formatLabel(s)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Grade Year</Label>
              <Select onValueChange={(v) => setValue('gradeYear', v)} disabled={isLoading}>
                <SelectTrigger>
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  {GRADE_YEARS.map((g) => (
                    <SelectItem key={g} value={g}>
                      {formatLabel(g)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Input
              id="description"
              placeholder="Brief description of the class"
              {...register('description')}
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lessonsPerWeek">Lessons/Week</Label>
              <Input
                id="lessonsPerWeek"
                type="number"
                min={1}
                max={10}
                {...register('lessonsPerWeek')}
                disabled={isLoading}
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
                disabled={isLoading}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Class
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
