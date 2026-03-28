import { NextResponse } from 'next/server';

import { lessonPlanSchema } from '@edumind/shared';

import { requireAuth } from '@/lib/auth/helpers';
import { db } from '@/lib/db';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await requireAuth();

    const lesson = await db.lesson.findUnique({
      where: { id: params.id },
      include: {
        class: { select: { tenantId: true } },
      },
    });

    if (!lesson || lesson.class.tenantId !== session.user.tenantId) {
      return NextResponse.json({ message: 'Lesson not found' }, { status: 404 });
    }

    const plan = await db.lessonPlan.findUnique({
      where: { lessonId: params.id },
    });

    return NextResponse.json({ success: true, data: plan });
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await requireAuth();

    const lesson = await db.lesson.findUnique({
      where: { id: params.id },
      include: {
        class: {
          select: {
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

    const body = await req.json();
    const parsed = lessonPlanSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: 'Validation failed', errors: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const plan = await db.lessonPlan.upsert({
      where: { lessonId: params.id },
      create: {
        lessonId: params.id,
        objectives: parsed.data.objectives,
        materials: parsed.data.materials,
        structure: parsed.data.structure,
        generatedByAi: false,
      },
      update: {
        objectives: parsed.data.objectives,
        materials: parsed.data.materials,
        structure: parsed.data.structure,
      },
    });

    return NextResponse.json({ success: true, data: plan });
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
