import { z } from 'zod';

export const createLessonSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  topic: z.string().min(1, 'Topic is required').max(200),
  description: z.string().max(1000).optional(),
  scheduledAt: z.string().datetime({ message: 'Valid date/time required' }),
  duration: z.number().int().min(15).max(180).default(45),
});

export const updateLessonSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  topic: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional().nullable(),
  scheduledAt: z.string().datetime().optional(),
  duration: z.number().int().min(15).max(180).optional(),
  teacherNotes: z.string().max(5000).optional().nullable(),
});

const attendanceEntrySchema = z.object({
  studentId: z.string().min(1),
  present: z.boolean(),
  participationScore: z.number().int().min(0).max(10).optional(),
  notes: z.string().max(500).optional(),
});

export const completeLessonSchema = z.object({
  attendance: z.array(attendanceEntrySchema).min(1, 'At least one attendance entry required'),
  teacherNotes: z.string().max(5000).optional(),
});

export const lessonPlanSchema = z.object({
  objectives: z.array(z.string().max(500)).max(20).default([]),
  materials: z
    .array(
      z.object({
        name: z.string(),
        url: z.string().optional(),
        type: z.string().optional(),
      }),
    )
    .default([]),
  structure: z
    .object({
      introduction: z.string().optional(),
      mainContent: z.string().optional(),
      activities: z.string().optional(),
      conclusion: z.string().optional(),
    })
    .default({}),
});

export type CreateLessonInput = z.infer<typeof createLessonSchema>;
export type UpdateLessonInput = z.infer<typeof updateLessonSchema>;
export type CompleteLessonInput = z.infer<typeof completeLessonSchema>;
export type LessonPlanInput = z.infer<typeof lessonPlanSchema>;
