import { suggestGrade } from '@/lib/ai/suggest-grade';
import { withAiRoute } from '@/lib/ai/middleware';

export async function POST(req: Request) {
  return withAiRoute(req, {
    type: 'homework_check',
    allowedRoles: ['TEACHER', 'TECH_ADMIN', 'SCHOOL_ADMIN'],
    handler: async (body) => {
      const { homeworkId, studentId, instructions, content, maxScore, rubric, subject, topic } = body as {
        homeworkId: string;
        studentId: string;
        instructions: string;
        content: string;
        maxScore: number;
        rubric?: unknown;
        subject?: string;
        topic?: string;
      };

      if (!homeworkId || !studentId || !instructions || !content || !maxScore) {
        throw new Error('Missing required fields');
      }

      const result = await suggestGrade({
        homeworkId,
        studentId,
        instructions,
        content,
        maxScore,
        rubric: rubric as Parameters<typeof suggestGrade>[0]['rubric'],
        subject,
        topic,
      });

      if (!result) return null;

      return { response: result.suggestion, usage: result.usage };
    },
  });
}
