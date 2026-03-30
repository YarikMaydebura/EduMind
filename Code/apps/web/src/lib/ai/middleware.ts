import { NextResponse } from 'next/server';

import type { UserRole } from '@edumind/shared';

import { requireAuth } from '@/lib/auth/helpers';
import { db } from '@/lib/db';

import type { AITask, AiUsage } from './config';
import { STUDENT_DAILY_LIMIT, TOKEN_COSTS, TASK_CONFIG } from './config';

export interface AiRouteContext {
  userId: string;
  tenantId: string;
  role: UserRole;
}

export interface AiRouteResult {
  response: unknown;
  usage: AiUsage;
}

export async function withAiRoute(
  req: Request,
  options: {
    type: AITask;
    allowedRoles: UserRole[];
    handler: (body: Record<string, unknown>, ctx: AiRouteContext) => Promise<AiRouteResult | null>;
  },
): Promise<NextResponse> {
  const startTime = Date.now();
  const { model } = TASK_CONFIG[options.type];
  let ctx: AiRouteContext | null = null;

  try {
    const session = await requireAuth();

    if (!options.allowedRoles.includes(session.user.role)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    ctx = {
      userId: session.user.id,
      tenantId: session.user.tenantId,
      role: session.user.role,
    };

    // --- Tenant rate limit ---
    const tenant = await db.tenant.findUnique({
      where: { id: ctx.tenantId },
      select: { aiRequestsLimit: true, aiRequestsUsed: true, aiRequestsResetAt: true },
    });

    if (tenant) {
      const now = new Date();
      if (!tenant.aiRequestsResetAt || tenant.aiRequestsResetAt < now) {
        // Reset daily counter
        const tomorrow = new Date(now);
        tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
        tomorrow.setUTCHours(0, 0, 0, 0);
        await db.tenant.update({
          where: { id: ctx.tenantId },
          data: { aiRequestsUsed: 0, aiRequestsResetAt: tomorrow },
        });
      } else if (tenant.aiRequestsUsed >= tenant.aiRequestsLimit) {
        return NextResponse.json(
          { message: 'AI request limit reached for your organization' },
          { status: 429 },
        );
      }
    }

    // --- Per-student daily limit ---
    if (session.user.role === 'STUDENT') {
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const recentCount = await db.aiGenerationLog.count({
        where: {
          userId: ctx.userId,
          createdAt: { gte: twentyFourHoursAgo },
        },
      });
      if (recentCount >= STUDENT_DAILY_LIMIT) {
        return NextResponse.json(
          { message: 'You have reached your daily AI limit. Try again tomorrow!' },
          { status: 429 },
        );
      }
    }

    // --- Execute handler ---
    const body = await req.json();
    const result = await options.handler(body, ctx);
    const latencyMs = Date.now() - startTime;

    if (!result) {
      // Log failed generation
      await logGeneration(ctx, options.type, model, null, latencyMs, false, 'AI returned no result');
      return NextResponse.json({ message: 'AI generation failed' }, { status: 500 });
    }

    // --- Log successful generation ---
    await logGeneration(ctx, options.type, model, result.usage, latencyMs, true);

    // --- Increment tenant counter ---
    await db.tenant.update({
      where: { id: ctx.tenantId },
      data: { aiRequestsUsed: { increment: 1 } },
    });

    return NextResponse.json({ success: true, data: result.response });
  } catch (error) {
    const latencyMs = Date.now() - startTime;
    if (ctx) {
      await logGeneration(
        ctx,
        options.type,
        model,
        null,
        latencyMs,
        false,
        error instanceof Error ? error.message : 'Unknown error',
      ).catch(() => {});
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

async function logGeneration(
  ctx: AiRouteContext,
  type: string,
  model: string,
  usage: AiUsage | null,
  latencyMs: number,
  success: boolean,
  errorMessage?: string,
) {
  const inputTokens = usage?.input_tokens ?? 0;
  const outputTokens = usage?.output_tokens ?? 0;
  const costs = TOKEN_COSTS[model] ?? { input: 0, output: 0 };
  const costUsd = inputTokens * costs.input + outputTokens * costs.output;

  await db.aiGenerationLog.create({
    data: {
      tenantId: ctx.tenantId,
      userId: ctx.userId,
      type,
      model,
      inputTokens,
      outputTokens,
      totalTokens: inputTokens + outputTokens,
      costUsd,
      latencyMs,
      success,
      errorMessage,
    },
  });
}
