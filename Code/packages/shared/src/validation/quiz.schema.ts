import { z } from 'zod';

const questionOptionSchema = z.object({
  text: z.string().min(1, 'Option text is required').max(500),
  isCorrect: z.boolean(),
});

export const questionSchema = z
  .object({
    type: z.enum(['MCQ', 'TRUE_FALSE', 'SHORT_ANSWER']),
    question: z.string().min(1, 'Question is required').max(1000),
    options: z.array(questionOptionSchema).optional(),
    correctAnswer: z.string().max(500).optional(),
    points: z.number().int().min(1).max(100).default(10),
    explanation: z.string().max(500).optional(),
  })
  .refine(
    (q) => {
      if (q.type === 'MCQ') {
        return q.options && q.options.length >= 2 && q.options.some((o) => o.isCorrect);
      }
      if (q.type === 'TRUE_FALSE') {
        return q.options && q.options.length === 2 && q.options.some((o) => o.isCorrect);
      }
      if (q.type === 'SHORT_ANSWER') {
        return q.correctAnswer && q.correctAnswer.trim().length > 0;
      }
      return true;
    },
    {
      message:
        'MCQ needs 2+ options with at least one correct; TRUE_FALSE needs 2 options; SHORT_ANSWER needs correctAnswer',
    },
  );

export const createQuizSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(2000).optional(),
  type: z.enum(['DIAGNOSTIC', 'PRACTICE', 'TEST', 'EXAM', 'BOSS_BATTLE']).default('PRACTICE'),
  questions: z.array(questionSchema).min(1, 'At least one question is required'),
  timeLimit: z.number().int().min(30).optional(),
  shuffleQuestions: z.boolean().default(true),
  showCorrectAnswers: z.boolean().default(true),
  allowRetakes: z.boolean().default(false),
  maxAttempts: z.number().int().min(1).max(10).default(1),
  availableFrom: z.string().datetime().optional(),
  availableUntil: z.string().datetime().optional(),
  isBossBattle: z.boolean().default(false),
  bossName: z.string().max(100).optional(),
  difficulty: z.number().int().min(0).max(100).default(50),
});

export const updateQuizSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional().nullable(),
  type: z.enum(['DIAGNOSTIC', 'PRACTICE', 'TEST', 'EXAM', 'BOSS_BATTLE']).optional(),
  questions: z.array(questionSchema).min(1).optional(),
  timeLimit: z.number().int().min(30).optional().nullable(),
  shuffleQuestions: z.boolean().optional(),
  showCorrectAnswers: z.boolean().optional(),
  allowRetakes: z.boolean().optional(),
  maxAttempts: z.number().int().min(1).max(10).optional(),
  availableFrom: z.string().datetime().optional().nullable(),
  availableUntil: z.string().datetime().optional().nullable(),
  isBossBattle: z.boolean().optional(),
  bossName: z.string().max(100).optional().nullable(),
  difficulty: z.number().int().min(0).max(100).optional(),
});

export const submitQuizSchema = z.object({
  answers: z.array(
    z.object({
      questionIndex: z.number().int().min(0),
      answer: z.string(),
    }),
  ),
  startedAt: z.string().datetime(),
  timeSpent: z.number().int().min(0).optional(),
});

export type QuestionInput = z.infer<typeof questionSchema>;
export type CreateQuizInput = z.infer<typeof createQuizSchema>;
export type UpdateQuizInput = z.infer<typeof updateQuizSchema>;
export type SubmitQuizInput = z.infer<typeof submitQuizSchema>;
