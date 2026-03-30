import type { RubricCriterion } from '@edumind/shared';

import { anthropic } from './client';
import type { AiUsage } from './config';
import { TASK_CONFIG } from './config';
import { buildHomeworkCheckPrompt } from './prompts';

export interface AiGradeSuggestion {
  score: number;
  feedback: string;
  rubricScores?: Array<{ criterionId: string; score: number; feedback?: string }>;
  confidence: number;
}

export async function suggestGrade(params: {
  homeworkId: string;
  studentId: string;
  studentName?: string;
  studentLevel?: number;
  subject?: string;
  topic?: string;
  instructions: string;
  content: string;
  maxScore: number;
  rubric?: RubricCriterion[];
}): Promise<{ suggestion: AiGradeSuggestion; usage: AiUsage } | null> {
  try {
    const prompt = buildHomeworkCheckPrompt({
      subject: params.subject ?? 'General',
      topic: params.topic ?? 'Homework',
      instructions: params.instructions,
      maxScore: params.maxScore,
      rubric: params.rubric?.map((r) => ({
        id: r.id,
        name: r.name,
        description: r.description ?? '',
        maxPoints: r.maxPoints,
      })),
      submissionContent: params.content,
      studentLevel: params.studentLevel ?? 1,
      studentName: params.studentName ?? 'Student',
    });

    const { model, maxTokens } = TASK_CONFIG.homework_check;
    const response = await anthropic.messages.create({
      model,
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = response.content[0]?.type === 'text' ? response.content[0].text : '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    const parsed = JSON.parse(jsonMatch[0]) as {
      score: number;
      feedback: string;
      rubricScores?: Array<{ criterionId: string; score: number; feedback?: string }>;
      confidence: number;
    };

    return {
      suggestion: {
        score: Math.min(Math.max(0, Math.round(parsed.score)), params.maxScore),
        feedback: parsed.feedback ?? '',
        rubricScores: parsed.rubricScores,
        confidence: Math.min(1, Math.max(0, parsed.confidence ?? 0.8)),
      },
      usage: {
        input_tokens: response.usage.input_tokens,
        output_tokens: response.usage.output_tokens,
      },
    };
  } catch {
    return null;
  }
}
