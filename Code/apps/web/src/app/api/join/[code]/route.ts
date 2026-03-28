import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

import { db } from '@/lib/db';

export async function GET(_req: Request, { params }: { params: { code: string } }) {
  try {
    const invite = await db.invite.findUnique({
      where: { code: params.code },
      include: {
        tenant: { select: { id: true, name: true } },
        class: { select: { id: true, name: true, subject: true } },
      },
    });

    if (!invite) {
      return NextResponse.json({ message: 'Invalid invite code' }, { status: 404 });
    }

    if (invite.expiresAt < new Date()) {
      return NextResponse.json({ message: 'Invite has expired' }, { status: 410 });
    }

    if (invite.usedCount >= invite.maxUses) {
      return NextResponse.json({ message: 'Invite has reached maximum uses' }, { status: 410 });
    }

    return NextResponse.json({
      success: true,
      data: {
        role: invite.role,
        tenant: invite.tenant,
        class: invite.class,
        email: invite.email,
      },
    });
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: { code: string } }) {
  try {
    const invite = await db.invite.findUnique({
      where: { code: params.code },
    });

    if (!invite) {
      return NextResponse.json({ message: 'Invalid invite code' }, { status: 404 });
    }

    if (invite.expiresAt < new Date() || invite.usedCount >= invite.maxUses) {
      return NextResponse.json({ message: 'Invite is no longer valid' }, { status: 410 });
    }

    const body = await req.json();
    const { email, password, firstName, lastName, gradeYear } = body;

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ message: 'Email already registered' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await db.$transaction(async (tx: any) => {
      const user = await tx.user.create({
        data: {
          email,
          passwordHash,
          firstName,
          lastName,
          role: invite.role,
          tenantId: invite.tenantId,
          isActive: true,
        },
      });

      if (invite.role === 'STUDENT') {
        const validGradeYears = [
          'GRADE_1','GRADE_2','GRADE_3','GRADE_4','GRADE_5','GRADE_6',
          'GRADE_7','GRADE_8','GRADE_9','GRADE_10','GRADE_11','GRADE_12',
        ];
        const student = await tx.student.create({
          data: {
            userId: user.id,
            gradeYear: validGradeYears.includes(gradeYear) ? gradeYear : 'GRADE_7',
          },
        });

        if (invite.classId) {
          await tx.classEnrollment.create({
            data: {
              studentId: student.id,
              classId: invite.classId,
            },
          });
          await tx.studentClassProfile.create({
            data: {
              studentId: student.id,
              classId: invite.classId,
            },
          });
        }
      } else if (invite.role === 'TEACHER') {
        await tx.teacher.create({
          data: { userId: user.id },
        });
      } else if (invite.role === 'PARENT') {
        await tx.parent.create({
          data: { userId: user.id },
        });
      }

      await tx.invite.update({
        where: { id: invite.id },
        data: { usedCount: { increment: 1 } },
      });

      return user;
    });

    return NextResponse.json(
      { success: true, data: { userId: result.id } },
      { status: 201 },
    );
  } catch (error) {
    console.error('Join error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
