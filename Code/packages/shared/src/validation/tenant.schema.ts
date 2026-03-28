import { z } from 'zod';

export const updateTenantSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  logo: z.string().url().optional().nullable(),
  settings: z
    .object({
      allowStudentRegistration: z.boolean().optional(),
      requireApproval: z.boolean().optional(),
      defaultLanguage: z.string().max(10).optional(),
    })
    .optional(),
});

export type UpdateTenantInput = z.infer<typeof updateTenantSchema>;
