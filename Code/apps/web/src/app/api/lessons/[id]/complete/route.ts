import { NextResponse } from 'next/server';

import { calculateLessonXP, completeLessonSchema } from '@edumind/shared';

import { requireAuth } from '@/lib/auth/helpers';
import { db } from '@/lib/db';
import { awardXP } from '@/lib/gamification/award-xp';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await requireAuth();

    const lesson = await db.lesson.findUnique({
      where: { id: params.id },
      include: {
        class: {
          select: {
            id: true,
            tenantId: true,
            teacher: { select: { userId: true } },
          },
        },
      },
    });

    if (!lesson || lesson.class.tenantId !== session.user.tenantId) {
      return NextResponse.json({ message: 'Lesson not found' }, { status: 404 });
    }

    const isAdmin = ['TECH_ADMIN', 'SCHOOL_ADMIN'].includes(session.user.role);
    const isOwner = session.user.role === 'TEACHER' && lesson.class.teacher.userId === session.user.id;

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    if (lesson.status !== 'IN_PROGRESS') {
      return NextResponse.json(
        { message: 'Can only complete in-progress lessons' },
        { status: 400 },
      );
    }

    const body = await req.json();
    const parsed = completeLessonSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: 'Validation failed', errors: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const xpAwarded: Record<string, number> = {};

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await db.$transaction(async (tx: any) => {
      // Update lesson status
      await tx.lesson.update({
        where: { id: params.id },
        data: {
          status: 'COMPLETED',
          completedAt: new Date(),
          teacherNotes: parsed.data.teacherNotes,
        },
      });

      // Process each attendance entry
      for (const entry of parsed.data.attendance) {
        await tx.lessonAttendance.create({
          data: {
            lessonId: params.id,
            studentId: entry.studentId,
            present: entry.present,
            participationScore: entry.participationScore,
            notes: entry.notes,
          },
        });

        // Award XP to present students
        if (entry.present) {
          const participated = (entry.participationScore ?? 0) > 0;
          const xpEvent = calculateLessonXP(true, participated);

          // Domain-specific update (lessonsCompleted)
          const profile = await tx.studentClassProfile.findUnique({
            where: {
              studentId_classId: {
                studentId: entry.studentId,
                classId: lesson.class.id,
              },
            },
          });

          if (profile) {
            await tx.studentClassProfile.update({
              where: { id: profile.id },
              data: { lessonsCompleted: { increment: 1 } },
            });
          }

          // Get userId for notifications
          const studentRecord = await tx.student.findUnique({
            where: { id: entry.studentId },
            select: { userId: true },
          });

          // Award XP (handles class profile XP, student XP, activity feed, level-up, grade)
          await awardXP({
            tx,
            studentId: entry.studentId,
            classProfileId: profile?.id ?? '',
            classId: lesson.class.id,
            userId: studentRecord?.userId ?? '',
            xpEvent,
            activityType: 'LESSON_COMPLETED',
            activityTitle: `Attended lesson: ${lesson.title}`,
            relatedType: 'lesson',
            relatedId: params.id,
          });

          xpAwarded[entry.studentId] = xpEvent.totalXP;
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: { lessonId: params.id, xpAwarded },
    });
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
