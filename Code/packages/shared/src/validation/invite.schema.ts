import { z } from 'zod';

export const createInviteSchema = z.object({
  role: z.enum(['TEACHER', 'STUDENT', 'PARENT']),
  email: z.string().email().optional(),
  maxUses: z.number().int().min(1).max(500).default(1),
  expiresInDays: z.number().int().min(1).max(90).default(7),
  classId: z.string().optional(),
});

export type CreateInviteInput = z.infer<typeof createInviteSchema>;
