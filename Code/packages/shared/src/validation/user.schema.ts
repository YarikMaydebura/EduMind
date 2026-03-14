import { z } from 'zod';

export const updateProfileSchema = z.object({
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
  avatarUrl: z.string().url().optional().nullable(),
  avatarStyle: z.enum(['REALISTIC', 'ANIME', 'PIXEL', 'CHIBI', 'COMIC']).optional(),
  themePreference: z.enum(['LIGHT', 'DARK', 'SYSTEM']).optional(),
  language: z.string().max(10).optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
