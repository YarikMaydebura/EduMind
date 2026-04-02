import { z } from 'zod';

export const awakenCharacterSchema = z.object({
  theme: z.enum([
    'FANTASY',
    'CYBERPUNK_THEME',
    'MILITARY',
    'SCI_FI',
    'ANIME',
    'STEAMPUNK_THEME',
  ]),
  classId: z.string().min(1),
});

export type AwakenCharacterInput = z.infer<typeof awakenCharacterSchema>;
