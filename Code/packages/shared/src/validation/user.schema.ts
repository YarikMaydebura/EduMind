import { z } from 'zod';

export const updateProfileSchema = z.object({
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
  avatarUrl: z.string().url().optional().nullable(),
  avatarStyle: z.enum(['REALISTIC', 'ANIME', 'PIXEL', 'CHIBI', 'COMIC']).optional(),
  themePreference: z
    .enum(['DARK_MODERN', 'PLAYFUL_COLORFUL', 'CORPORATE_PROFESSIONAL', 'WARM_FRIENDLY', 'SYSTEM'])
    .optional(),
  language: z.string().max(10).optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export const createUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  role: z.enum(['TEACHER', 'STUDENT', 'PARENT']),
  password: z.string().min(8).optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

export const assignRoleSchema = z.object({
  role: z.enum(['SCHOOL_ADMIN', 'TEACHER', 'STUDENT', 'PARENT']),
});

export type AssignRoleInput = z.infer<typeof assignRoleSchema>;
