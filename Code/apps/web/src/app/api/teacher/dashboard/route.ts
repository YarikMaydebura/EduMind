import { NextResponse } from 'next/server';

import { requireAuth } from '@/lib/auth/helpers';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const session = await requireAuth();

    if (session.user.role !== 'TEACHER') {
      return NextResponse.json({ message: 'Teachers only' }, { status: 403 });
    }

    const teacher = await db.teacher.findUnique({
      where: { userId: session.user.id },
    });

    if (!teacher) {
      return NextResponse.json({ message: 'Teacher profile not found' }, { status: 404 });
    }

    const tenantId = session.user.tenantId;
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    // Parallel queries for stats + data
    const [
      classes,
      ungradedCount,
      totalHomeworks,
      totalQuizzes,
      totalLessons,
      upcomingLessons,
      ungradedSubmissions,
      recentQuizResults,
    ] = await Promise.all([
      // Classes with student counts
      db.class.findMany({
        where: { teacherId: teacher.id, tenantId, isArchived: false },
        include: {
          _count: {
            select: { enrollments: { where: { isActive: true } } },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),

      // Ungraded submissions count
      db.homeworkSubmission.count({
        where: { homework: { teacherId: teacher.id }, status: 'SUBMITTED' },
      }),

      // Total homeworks
      db.homework.count({ where: { teacherId: teacher.id } }),

      // Total quizzes
      db.quiz.count({ where: { teacherId: teacher.id } }),

      // Total lessons
      db.lesson.count({ where: { teacherId: teacher.id } }),

      // Upcoming lessons (next 7 days)
      db.lesson.findMany({
        where: {
          teacherId: teacher.id,
          scheduledAt: { gte: now, lte: nextWeek },
          status: 'SCHEDULED',
        },
        include: {
          class: { select: { name: true, subject: true } },
        },
        orderBy: { scheduledAt: 'asc' },
        take: 5,
      }),

      // Recent ungraded submissions
      db.homeworkSubmission.findMany({
        where: { homework: { teacherId: teacher.id }, status: 'SUBMITTED' },
        include: {
          homework: { select: { id: true, title: true, classId: true } },
          student: {
            include: { user: { select: { firstName: true, lastName: true } } },
          },
        },
        orderBy: { submittedAt: 'desc' },
        take: 5,
      }),

      // Recent quiz results
      db.quizResult.findMany({
        where: { quiz: { teacherId: teacher.id } },
        include: {
          quiz: { select: { title: true } },
          student: {
            include: { user: { select: { firstName: true, lastName: true } } },
          },
        },
        orderBy: { completedAt: 'desc' },
        take: 5,
      }),
    ]);

    const totalStudents = classes.reduce((sum, c) => sum + c._count.enrollments, 0);

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalClasses: classes.length,
          totalStudents,
          ungradedCount,
          totalHomeworks,
          totalQuizzes,
          totalLessons,
        },
        classes: classes.map((c) => ({
          id: c.id,
          name: c.name,
          subject: c.subject,
          studentCount: c._count.enrollments,
        })),
        upcomingLessons: upcomingLessons.map((l) => ({
          id: l.id,
          title: l.title,
          topic: l.topic,
          scheduledAt: l.scheduledAt,
          duration: l.duration,
          className: l.class.name,
          classSubject: l.class.subject,
        })),
        ungradedSubmissions: ungradedSubmissions.map((s) => ({
          homeworkId: s.homework.id,
          homeworkTitle: s.homework.title,
          classId: s.homework.classId,
          studentId: s.studentId,
          studentName: `${s.student.user.firstName} ${s.student.user.lastName}`,
          submittedAt: s.submittedAt,
        })),
        recentQuizResults: recentQuizResults.map((r) => ({
          quizTitle: r.quiz.title,
          studentName: `${r.student.user.firstName} ${r.student.user.lastName}`,
          score: r.score,
          percentage: r.percentage,
          completedAt: r.completedAt,
        })),
      },
    });
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
