import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { requireRole } from '@/lib/auth/helpers';
import { db } from '@/lib/db';

import { StudentClassDetail } from './student-class-detail';

export const metadata: Metadata = { title: 'Class | EduMind AI' };

export default async function StudentClassDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await requireRole('STUDENT');

  const student = await db.student.findUnique({
    where: { userId: session.user.id },
  });

  if (!student) return notFound();

  const enrollment = await db.classEnrollment.findUnique({
    where: {
      classId_studentId: { classId: params.id, studentId: student.id },
    },
  });

  if (!enrollment?.isActive) return notFound();

  const classData = await db.class.findUnique({
    where: { id: params.id },
    include: {
      teacher: {
        select: {
          user: { select: { firstName: true, lastName: true } },
        },
      },
    },
  });

  if (!classData) return notFound();

  const profile = await db.studentClassProfile.findUnique({
    where: {
      studentId_classId: { studentId: student.id, classId: params.id },
    },
  });

  // Top 5 students for mini-leaderboard
  const topProfiles = await db.studentClassProfile.findMany({
    where: { classId: params.id },
    orderBy: { classXp: 'desc' },
    take: 5,
    include: {
      student: {
        select: {
          id: true,
          overallLevel: true,
          user: {
            select: { firstName: true, lastName: true, avatar: true },
          },
        },
      },
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const miniLeaderboard = topProfiles.map((tp: any, i: number) => ({
    rank: i + 1,
    studentId: tp.student.id,
    firstName: tp.student.user.firstName,
    lastName: tp.student.user.lastName,
    avatar: tp.student.user.avatar,
    level: tp.student.overallLevel,
    classXp: tp.classXp,
    isCurrentUser: tp.studentId === student.id,
  }));

  return (
    <StudentClassDetail
      classInfo={{
        id: classData.id,
        name: classData.name,
        subject: classData.subject,
        gradeYear: classData.gradeYear,
        description: classData.description,
        teacherName: `${classData.teacher.user.firstName} ${classData.teacher.user.lastName}`,
      }}
      profile={
        profile
          ? {
              classXp: profile.classXp,
              classLevel: profile.classLevel,
              classGrade: profile.classGrade,
              averageScore: profile.averageScore,
              lessonsCompleted: profile.lessonsCompleted,
              homeworkCompleted: profile.homeworkCompleted,
              quizzesCompleted: profile.quizzesCompleted,
            }
          : null
      }
      miniLeaderboard={miniLeaderboard}
    />
  );
}
