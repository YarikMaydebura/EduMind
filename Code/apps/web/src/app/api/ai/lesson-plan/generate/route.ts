import { db } from '@/lib/db';
import { generateLessonPlan } from '@/lib/ai/generate-lesson-plan';
import { withAiRoute } from '@/lib/ai/middleware';

export async function POST(req: Request) {
  return withAiRoute(req, {
    type: 'lesson_plan',
    allowedRoles: ['TEACHER', 'TECH_ADMIN', 'SCHOOL_ADMIN'],
    handler: async (body, ctx) => {
      const { subject, gradeYear, topic, duration, classSize, previousTopics, objectives, save, lessonId } =
        body as {
          lessonId?: string;
          subject: string;
          gradeYear: string;
          topic: string;
          duration: number;
          classSize?: number;
          previousTopics?: string[];
          objectives?: string[];
          save?: boolean;
        };

      if (!subject || !gradeYear || !topic || !duration) {
        throw new Error('Missing required fields: subject, gradeYear, topic, duration');
      }

      const result = await generateLessonPlan({
        subject,
        gradeYear,
        topic,
        duration,
        classSize: classSize ?? 20,
        previousTopics,
        objectives,
      });

      if (!result) return null;

      // Optionally save to DB
      if (save && lessonId) {
        const lesson = await db.lesson.findUnique({
          where: { id: lessonId },
          include: { class: { select: { tenantId: true, teacher: { select: { userId: true } } } } },
        });

        if (lesson && lesson.class.tenantId === ctx.tenantId) {
          const isOwner = ctx.role === 'TEACHER' && lesson.class.teacher.userId === ctx.userId;
          const isAdmin = ['TECH_ADMIN', 'SCHOOL_ADMIN'].includes(ctx.role);

          if (isOwner || isAdmin) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const planJson = JSON.parse(JSON.stringify(result.plan)) as any;
            await db.lessonPlan.upsert({
              where: { lessonId },
              create: {
                lessonId,
                objectives: result.plan.objectives,
                materials: result.plan.materials,
                structure: planJson,
                generatedByAi: true,
              },
              update: {
                objectives: result.plan.objectives,
                materials: result.plan.materials,
                structure: planJson,
                generatedByAi: true,
              },
            });
          }
        }
      }

      return { response: result.plan, usage: result.usage };
    },
  });
}
