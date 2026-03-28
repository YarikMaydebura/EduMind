export const AI_MODELS = {
  SONNET: 'claude-sonnet-4-6',
  HAIKU: 'claude-haiku-4-5-20251001',
} as const;

export type AITask =
  | 'lesson_plan'
  | 'quiz_generation'
  | 'homework_check'
  | 'student_qa'
  | 'teacher_assist';

export const TASK_CONFIG: Record<AITask, { model: string; maxTokens: number }> = {
  lesson_plan:      { model: AI_MODELS.SONNET, maxTokens: 3000 },
  quiz_generation:  { model: AI_MODELS.SONNET, maxTokens: 2500 },
  homework_check:   { model: AI_MODELS.HAIKU,  maxTokens: 1000 },
  student_qa:       { model: AI_MODELS.HAIKU,  maxTokens: 800  },
  teacher_assist:   { model: AI_MODELS.HAIKU,  maxTokens: 800  },
};
