'use client';

import { Loader2, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
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

interface RubricCriterion {
  id: string;
  name: string;
  maxPoints: number;
  description?: string;
}

interface FormValues {
  title: string;
  description: string;
  instructions: string;
  dueAt: string;
  maxScore: number;
  passingScore: number;
  useRubric: boolean;
  rubric: RubricCriterion[];
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classId: string;
  onCreated: () => void;
}

export function CreateHomeworkDialog({ open, onOpenChange, classId, onCreated }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, reset, control, setValue } = useForm<FormValues>({
    defaultValues: {
      title: '',
      description: '',
      instructions: '',
      dueAt: '',
      maxScore: 100,
      passingScore: 60,
      useRubric: false,
      rubric: [],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'rubric' });
  const useRubric = useWatch({ control, name: 'useRubric' });
  const rubricValues = useWatch({ control, name: 'rubric' });

  // Auto-compute maxScore from rubric criteria sum
  useEffect(() => {
    if (useRubric && rubricValues && rubricValues.length > 0) {
      const sum = rubricValues.reduce((acc, c) => acc + (Number(c.maxPoints) || 0), 0);
      setValue('maxScore', sum);
    }
  }, [useRubric, rubricValues, setValue]);

  function addCriterion() {
    append({ id: crypto.randomUUID(), name: '', maxPoints: 10, description: '' });
  }

  async function onSubmit(data: FormValues) {
    setIsLoading(true);
    try {
      const dueAt = data.dueAt ? new Date(data.dueAt).toISOString() : '';

      const rubric =
        data.useRubric && data.rubric.length > 0
          ? data.rubric.map((c) => ({
              id: c.id,
              name: c.name,
              maxPoints: Number(c.maxPoints),
              description: c.description || undefined,
            }))
          : undefined;

      const res = await fetch(`/api/classes/${classId}/homeworks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          instructions: data.instructions || undefined,
          dueAt,
          maxScore: Number(data.maxScore),
          passingScore: Number(data.passingScore),
          rubric,
        }),
      });

      const json = await res.json();
      if (!json.success) {
        toast.error(json.message || 'Failed to create homework');
        return;
      }

      toast.success('Homework created!');
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
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Homework</DialogTitle>
          <DialogDescription>Assign a new homework to your class</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="e.g. Chapter 5 Exercises"
              {...register('title')}
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              placeholder="Describe the homework assignment..."
              {...register('description')}
              disabled={isLoading}
              required
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="instructions">Instructions (optional)</Label>
            <textarea
              id="instructions"
              placeholder="Detailed instructions for students..."
              {...register('instructions')}
              disabled={isLoading}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueAt">Due Date</Label>
            <Input
              id="dueAt"
              type="datetime-local"
              {...register('dueAt')}
              disabled={isLoading}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maxScore">Max Score</Label>
              <Input
                id="maxScore"
                type="number"
                min={1}
                max={1000}
                {...register('maxScore')}
                disabled={isLoading || useRubric}
                readOnly={useRubric}
              />
              {useRubric && (
                <p className="text-xs text-muted-foreground">
                  Auto-calculated from rubric
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="passingScore">Passing Score</Label>
              <Input
                id="passingScore"
                type="number"
                min={0}
                max={1000}
                {...register('passingScore')}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Rubric toggle */}
          <div className="flex items-center gap-3 rounded-md border p-3">
            <input
              type="checkbox"
              id="useRubric"
              {...register('useRubric')}
              disabled={isLoading}
              className="h-4 w-4 rounded border-gray-300"
            />
            <div>
              <Label htmlFor="useRubric" className="cursor-pointer font-medium">
                Use Rubric Grading
              </Label>
              <p className="text-xs text-muted-foreground">
                Define grading criteria with point breakdowns
              </p>
            </div>
          </div>

          {/* Rubric criteria editor */}
          {useRubric && (
            <div className="space-y-3 rounded-md border p-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Rubric Criteria</Label>
                <span className="text-xs text-muted-foreground">
                  Total:{' '}
                  {rubricValues?.reduce((sum, c) => sum + (Number(c.maxPoints) || 0), 0) || 0} pts
                </span>
              </div>

              {fields.map((field, index) => (
                <div key={field.id} className="space-y-2 rounded border bg-muted/30 p-3">
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Criterion name"
                      {...register(`rubric.${index}.name`)}
                      disabled={isLoading}
                      required
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      min={1}
                      max={1000}
                      placeholder="Pts"
                      {...register(`rubric.${index}.maxPoints`, { valueAsNumber: true })}
                      disabled={isLoading}
                      required
                      className="w-20"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                      disabled={isLoading}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  <Input
                    placeholder="Description (optional)"
                    {...register(`rubric.${index}.description`)}
                    disabled={isLoading}
                    className="text-xs"
                  />
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addCriterion}
                disabled={isLoading}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Criterion
              </Button>

              {fields.length === 0 && (
                <p className="text-center text-xs text-muted-foreground">
                  Add at least one criterion to use rubric grading
                </p>
              )}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Homework
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
