import { generateQuiz } from '@/lib/ai/generate-quiz';
import type { Difficulty, QuestionType } from '@/lib/ai/generate-quiz';
import { withAiRoute } from '@/lib/ai/middleware';

export async function POST(req: Request) {
  return withAiRoute(req, {
    type: 'quiz_generation',
    allowedRoles: ['TEACHER', 'TECH_ADMIN', 'SCHOOL_ADMIN'],
    handler: async (body) => {
      const { subject, gradeYear, topic, numQuestions, difficulty, questionTypes } = body as {
        subject: string;
        gradeYear: string;
        topic: string;
        numQuestions?: number;
        difficulty?: Difficulty;
        questionTypes?: QuestionType[];
      };

      if (!subject || !gradeYear || !topic) {
        throw new Error('Missing required fields: subject, gradeYear, topic');
      }

      const result = await generateQuiz({
        subject,
        gradeYear,
        topic,
        numQuestions: numQuestions ?? 10,
        difficulty: difficulty ?? 'MEDIUM',
        questionTypes: questionTypes ?? ['MULTIPLE_CHOICE'],
      });

      if (!result) return null;

      return { response: result.questions, usage: result.usage };
    },
  });
}
