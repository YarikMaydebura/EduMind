import { db } from '@/lib/db';
import { loadConversationHistory, saveConversationHistory } from '@/lib/ai/conversation-history';
import { withAiRoute } from '@/lib/ai/middleware';
import { studentTutor } from '@/lib/ai/student-tutor';

export async function POST(req: Request) {
  return withAiRoute(req, {
    type: 'student_qa',
    allowedRoles: ['STUDENT'],
    handler: async (body, ctx) => {
      const message = body.message as string | undefined;
      const subject = body.subject as string | undefined;

      if (!message?.trim()) {
        throw new Error('message is required');
      }
      if (!subject) {
        throw new Error('subject is required');
      }

      // Fetch student profile for personalization
      const student = await db.student.findUnique({
        where: { userId: ctx.userId },
        select: { id: true, overallLevel: true, user: { select: { firstName: true } } },
      });

      if (!student) {
        throw new Error('Student profile not found');
      }

      // Load existing conversation history
      const history = await loadConversationHistory(student.id, subject);

      // Append the new user message
      history.push({ role: 'user', content: message });

      // Call AI tutor
      const result = await studentTutor({
        messages: history,
        subject,
        studentName: student.user.firstName ?? 'Student',
        studentLevel: student.overallLevel ?? 1,
      });

      if (!result) return null;

      // Append assistant response and save
      history.push({ role: 'assistant', content: result.response });
      await saveConversationHistory(student.id, subject, history);

      return {
        response: { response: result.response },
        usage: result.usage,
      };
    },
  });
}
