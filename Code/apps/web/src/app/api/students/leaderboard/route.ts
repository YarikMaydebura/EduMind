import { NextResponse } from 'next/server';

import { requireAuth } from '@/lib/auth/helpers';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const session = await requireAuth();

    if (session.user.role !== 'STUDENT') {
      return NextResponse.json({ message: 'Students only' }, { status: 403 });
    }

    const currentStudent = await db.student.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });

    if (!currentStudent) {
      return NextResponse.json({ message: 'Student not found' }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const scope = searchParams.get('scope') || 'global';
    const classId = searchParams.get('classId');
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));

    if (scope === 'class') {
      if (!classId) {
        return NextResponse.json({ message: 'classId required for class scope' }, { status: 400 });
      }

      // Verify enrollment
      const enrollment = await db.classEnrollment.findUnique({
        where: { classId_studentId: { classId, studentId: currentStudent.id } },
      });
      if (!enrollment?.isActive) {
        return NextResponse.json({ message: 'Not enrolled in this class' }, { status: 403 });
      }

      // Class leaderboard: StudentClassProfile ordered by classXp
      const profiles = await db.studentClassProfile.findMany({
        where: {
          classId,
          student: { showOnLeaderboard: true },
        },
        orderBy: { classXp: 'desc' },
        take: limit,
        include: {
          student: {
            include: {
              user: { select: { firstName: true, lastName: true, avatar: true } },
            },
          },
        },
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const leaderboard = profiles.map((p: any, i: number) => ({
        rank: i + 1,
        studentId: p.studentId,
        firstName: p.student.user.firstName,
        lastName: p.student.user.lastName,
        avatar: p.student.user.avatar,
        title: p.student.title,
        totalXp: p.classXp,
        level: p.classLevel,
        grade: p.classGrade,
        streakDays: p.student.streakDays,
        isCurrentUser: p.studentId === currentStudent.id,
      }));

      // If current user not in top N, find their position
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let currentUserRank: any = null;
      if (!leaderboard.some((e: { isCurrentUser: boolean }) => e.isCurrentUser)) {
        const currentProfile = await db.studentClassProfile.findUnique({
          where: { studentId_classId: { studentId: currentStudent.id, classId } },
          include: {
            student: {
              include: { user: { select: { firstName: true, lastName: true, avatar: true } } },
            },
          },
        });

        if (currentProfile) {
          const higherCount = await db.studentClassProfile.count({
            where: {
              classId,
              classXp: { gt: currentProfile.classXp },
              student: { showOnLeaderboard: true },
            },
          });

          currentUserRank = {
            rank: higherCount + 1,
            studentId: currentProfile.studentId,
            firstName: currentProfile.student.user.firstName,
            lastName: currentProfile.student.user.lastName,
            avatar: currentProfile.student.user.avatar,
            title: currentProfile.student.title,
            totalXp: currentProfile.classXp,
            level: currentProfile.classLevel,
            grade: currentProfile.classGrade,
            streakDays: currentProfile.student.streakDays,
            isCurrentUser: true,
          };
        }
      }

      return NextResponse.json({ success: true, data: { leaderboard, currentUserRank } });
    }

    // Global scope: all students in same tenant
    const students = await db.student.findMany({
      where: {
        showOnLeaderboard: true,
        user: { tenantId: session.user.tenantId },
      },
      orderBy: { totalXp: 'desc' },
      take: limit,
      include: {
        user: { select: { firstName: true, lastName: true, avatar: true } },
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const leaderboard = students.map((s: any, i: number) => ({
      rank: i + 1,
      studentId: s.id,
      firstName: s.user.firstName,
      lastName: s.user.lastName,
      avatar: s.user.avatar,
      title: s.title,
      totalXp: s.totalXp,
      level: s.overallLevel,
      grade: s.currentGrade,
      streakDays: s.streakDays,
      isCurrentUser: s.id === currentStudent.id,
    }));

    // If current user not in top N, find their position
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let currentUserRank: any = null;
    if (!leaderboard.some((e: { isCurrentUser: boolean }) => e.isCurrentUser)) {
      const currentStudentFull = await db.student.findUnique({
        where: { id: currentStudent.id },
        include: { user: { select: { firstName: true, lastName: true, avatar: true } } },
      });

      if (currentStudentFull) {
        const higherCount = await db.student.count({
          where: {
            showOnLeaderboard: true,
            user: { tenantId: session.user.tenantId },
            totalXp: { gt: currentStudentFull.totalXp },
          },
        });

        currentUserRank = {
          rank: higherCount + 1,
          studentId: currentStudentFull.id,
          firstName: currentStudentFull.user.firstName,
          lastName: currentStudentFull.user.lastName,
          avatar: currentStudentFull.user.avatar,
          title: currentStudentFull.title,
          totalXp: currentStudentFull.totalXp,
          level: currentStudentFull.overallLevel,
          grade: currentStudentFull.currentGrade,
          streakDays: currentStudentFull.streakDays,
          isCurrentUser: true,
        };
      }
    }

    return NextResponse.json({ success: true, data: { leaderboard, currentUserRank } });
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
