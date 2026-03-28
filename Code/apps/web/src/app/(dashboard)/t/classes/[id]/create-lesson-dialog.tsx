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

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classId: string;
  onCreated: () => void;
}

export function CreateLessonDialog({ open, onOpenChange, classId, onCreated }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      title: '',
      topic: '',
      description: '',
      scheduledAt: '',
      duration: 45,
    },
  });

  async function onSubmit(data: Record<string, unknown>) {
    setIsLoading(true);
    try {
      const scheduledAt = data.scheduledAt
        ? new Date(data.scheduledAt as string).toISOString()
        : '';

      const res = await fetch(`/api/classes/${classId}/lessons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: data.title,
          topic: data.topic,
          description: data.description || undefined,
          scheduledAt,
          duration: Number(data.duration),
        }),
      });

      const json = await res.json();
      if (!json.success) {
        toast.error(json.message || 'Failed to create lesson');
        return;
      }

      toast.success('Lesson created!');
      reset();
      onOpenChange(false);
      onCreated();
    } catch {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Lesson</DialogTitle>
          <DialogDescription>Schedule a new lesson for this class</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="e.g. Introduction to Algebra"
              {...register('title')}
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="topic">Topic</Label>
            <Input
              id="topic"
              placeholder="e.g. Linear Equations"
              {...register('topic')}
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Input
              id="description"
              placeholder="Brief description of the lesson"
              {...register('description')}
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="scheduledAt">Date & Time</Label>
              <Input
                id="scheduledAt"
                type="datetime-local"
                {...register('scheduledAt')}
                disabled={isLoading}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (min)</Label>
              <Input
                id="duration"
                type="number"
                min={15}
                max={180}
                {...register('duration')}
                disabled={isLoading}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Lesson
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
