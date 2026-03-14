import { z } from 'zod';

export const createClassSchema = z.object({
  name: z.string().min(1, 'Class name is required').max(100),
  subject: z.string().min(1, 'Subject is required'),
  gradeYear: z.string().min(1, 'Grade year is required'),
  description: z.string().max(500).optional(),
  maxStudents: z.number().int().min(1).max(100).default(30),
});

export type CreateClassInput = z.infer<typeof createClassSchema>;
