import { z } from 'zod';

// ── Rubric Schemas ───────────────────────────────────────────────────────────

export const rubricCriterionSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(200),
  maxPoints: z.number().int().min(1).max(1000),
  description: z.string().max(500).optional(),
});

export const rubricScoreSchema = z.object({
  criterionId: z.string().min(1),
  score: z.number().int().min(0),
  feedback: z.string().max(1000).optional(),
});

// ── Homework Schemas ─────────────────────────────────────────────────────────

export const createHomeworkSchema = z
  .object({
    title: z.string().min(1, 'Title is required').max(200),
    description: z.string().min(1, 'Description is required').max(2000),
    instructions: z.string().max(5000).optional(),
    dueAt: z.string().datetime({ message: 'Valid date/time required' }),
    maxScore: z.number().int().min(1).max(1000).default(100),
    passingScore: z.number().int().min(0).max(1000).default(60),
    lessonId: z.string().optional(),
    rubric: z.array(rubricCriterionSchema).optional(),
  })
  .refine(
    (data) => {
      if (!data.rubric || data.rubric.length === 0) return true;
      const sum = data.rubric.reduce((acc, c) => acc + c.maxPoints, 0);
      return sum === data.maxScore;
    },
    { message: 'Sum of rubric criteria points must equal max score', path: ['rubric'] },
  );

export const updateHomeworkSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().min(1).max(2000).optional(),
  instructions: z.string().max(5000).optional().nullable(),
  dueAt: z.string().datetime().optional(),
  maxScore: z.number().int().min(1).max(1000).optional(),
  passingScore: z.number().int().min(0).max(1000).optional(),
  rubric: z.array(rubricCriterionSchema).optional().nullable(),
});

export const submitHomeworkSchema = z.object({
  content: z.string().max(10000).optional(),
});

export const gradeSubmissionSchema = z.object({
  score: z.number().int().min(0),
  teacherFeedback: z.string().max(5000).optional(),
  rubricScores: z.array(rubricScoreSchema).optional(),
});

// ── Types ────────────────────────────────────────────────────────────────────

export type RubricCriterion = z.infer<typeof rubricCriterionSchema>;
export type RubricScore = z.infer<typeof rubricScoreSchema>;
export type CreateHomeworkInput = z.infer<typeof createHomeworkSchema>;
export type UpdateHomeworkInput = z.infer<typeof updateHomeworkSchema>;
export type SubmitHomeworkInput = z.infer<typeof submitHomeworkSchema>;
export type GradeSubmissionInput = z.infer<typeof gradeSubmissionSchema>;
