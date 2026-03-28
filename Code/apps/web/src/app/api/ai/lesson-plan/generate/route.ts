import { NextResponse } from 'next/server';

import { requireAuth } from '@/lib/auth/helpers';
import { db } from '@/lib/db';
import { generateLessonPlan } from '@/lib/ai/generate-lesson-plan';

export async function POST(req: Request) {
  try {
    const session = await requireAuth();

    const isTeacherOrAdmin = ['TEACHER', 'TECH_ADMIN', 'SCHOOL_ADMIN'].includes(session.user.role);
    if (!isTeacherOrAdmin) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json() as {
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

    if (!body.subject || !body.gradeYear || !body.topic || !body.duration) {
      return NextResponse.json({ message: 'Missing required fields: subject, gradeYear, topic, duration' }, { status: 400 });
    }

    const plan = await generateLessonPlan({
      subject: body.subject,
      gradeYear: body.gradeYear,
      topic: body.topic,
      duration: body.duration,
      classSize: body.classSize ?? 20,
      previousTopics: body.previousTopics,
      objectives: body.objectives,
    });

    if (!plan) {
      return NextResponse.json({ message: 'AI generation failed. Please try again.' }, { status: 500 });
    }

    // Optionally save to DB
    if (body.save && body.lessonId) {
      const lesson = await db.lesson.findUnique({
        where: { id: body.lessonId },
        include: { class: { select: { tenantId: true, teacher: { select: { userId: true } } } } },
      });

      if (lesson && lesson.class.tenantId === session.user.tenantId) {
        const isOwner =
          session.user.role === 'TEACHER' && lesson.class.teacher.userId === session.user.id;
        const isAdmin = ['TECH_ADMIN', 'SCHOOL_ADMIN'].includes(session.user.role);

        if (isOwner || isAdmin) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const planJson = JSON.parse(JSON.stringify(plan)) as any;
          await db.lessonPlan.upsert({
            where: { lessonId: body.lessonId },
            create: {
              lessonId: body.lessonId,
              objectives: plan.objectives,
              materials: plan.materials,
              structure: planJson,
              generatedByAi: true,
            },
            update: {
              objectives: plan.objectives,
              materials: plan.materials,
              structure: planJson,
              generatedByAi: true,
            },
          });
        }
      }
    }

    return NextResponse.json({ success: true, data: plan });
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
