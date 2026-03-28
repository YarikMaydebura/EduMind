import { NextResponse } from 'next/server';

import { requireAuth } from '@/lib/auth/helpers';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const session = await requireAuth();

    if (!['SCHOOL_ADMIN', 'TECH_ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ message: 'Admins only' }, { status: 403 });
    }

    const tenantId = session.user.tenantId;

    const [
      tenant,
      totalUsers,
      teacherCount,
      studentCount,
      parentCount,
      activeClasses,
      archivedClasses,
      totalLessons,
      totalHomeworks,
      totalQuizzes,
      recentUsers,
      pendingInvites,
    ] = await Promise.all([
      // Tenant info
      db.tenant.findUnique({
        where: { id: tenantId },
        select: {
          name: true,
          plan: true,
          maxStudents: true,
          maxTeachers: true,
          aiRequestsUsed: true,
          aiRequestsLimit: true,
          trialEndsAt: true,
          subscriptionEndsAt: true,
        },
      }),

      // User counts
      db.user.count({ where: { tenantId, isActive: true } }),
      db.user.count({ where: { tenantId, role: 'TEACHER', isActive: true } }),
      db.user.count({ where: { tenantId, role: 'STUDENT', isActive: true } }),
      db.user.count({ where: { tenantId, role: 'PARENT', isActive: true } }),

      // Class counts
      db.class.count({ where: { tenantId, isArchived: false } }),
      db.class.count({ where: { tenantId, isArchived: true } }),

      // Content stats
      db.lesson.count({ where: { class: { tenantId } } }),
      db.homework.count({ where: { class: { tenantId } } }),
      db.quiz.count({ where: { class: { tenantId } } }),

      // Recent active users
      db.user.findMany({
        where: { tenantId, isActive: true, lastActiveAt: { not: null } },
        orderBy: { lastActiveAt: 'desc' },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          role: true,
          email: true,
          lastActiveAt: true,
          avatar: true,
        },
        take: 5,
      }),

      // Pending invites (not fully used and not expired)
      db.invite.count({
        where: {
          tenantId,
          expiresAt: { gt: new Date() },
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        tenant: tenant
          ? {
              name: tenant.name,
              plan: tenant.plan,
              maxStudents: tenant.maxStudents,
              maxTeachers: tenant.maxTeachers,
              aiRequestsUsed: tenant.aiRequestsUsed,
              aiRequestsLimit: tenant.aiRequestsLimit,
              trialEndsAt: tenant.trialEndsAt,
              subscriptionEndsAt: tenant.subscriptionEndsAt,
            }
          : null,
        userCounts: {
          total: totalUsers,
          teachers: teacherCount,
          students: studentCount,
          parents: parentCount,
        },
        classCounts: {
          active: activeClasses,
          archived: archivedClasses,
        },
        contentStats: {
          lessons: totalLessons,
          homeworks: totalHomeworks,
          quizzes: totalQuizzes,
        },
        recentUsers: recentUsers.map((u) => ({
          id: u.id,
          name: `${u.firstName} ${u.lastName}`,
          role: u.role,
          email: u.email,
          lastActiveAt: u.lastActiveAt,
          avatar: u.avatar,
        })),
        pendingInvites,
      },
    });
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
