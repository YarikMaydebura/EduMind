import { z } from 'zod';

export const createClassSchema = z.object({
  name: z.string().min(1, 'Class name is required').max(100),
  subject: z.string().min(1, 'Subject is required'),
  gradeYear: z.string().min(1, 'Grade year is required'),
  description: z.string().max(500).optional(),
  lessonsPerWeek: z.number().int().min(1).max(10).default(2),
  defaultDuration: z.number().int().min(15).max(180).default(45),
});

export const updateClassSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional().nullable(),
  lessonsPerWeek: z.number().int().min(1).max(10).optional(),
  defaultDuration: z.number().int().min(15).max(180).optional(),
  settings: z.record(z.unknown()).optional(),
  isArchived: z.boolean().optional(),
});

export const enrollStudentSchema = z.object({
  studentId: z.string().min(1, 'Student ID is required'),
});

export type CreateClassInput = z.infer<typeof createClassSchema>;
export type UpdateClassInput = z.infer<typeof updateClassSchema>;
export type EnrollStudentInput = z.infer<typeof enrollStudentSchema>;
