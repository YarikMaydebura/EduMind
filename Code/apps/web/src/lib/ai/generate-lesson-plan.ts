import { anthropic } from './client';
import { TASK_CONFIG } from './config';
import { buildLessonPlanPrompt } from './prompts';

export interface LessonPlanSection {
  duration: number;
  activity?: string;
  content?: string;
  description?: string;
  summary?: string;
  teacherTips?: string;
  homework?: string;
}

export interface GeneratedLessonPlan {
  objectives: string[];
  warmup: LessonPlanSection;
  introduction: LessonPlanSection;
  mainContent: LessonPlanSection;
  activities: LessonPlanSection;
  conclusion: LessonPlanSection;
  materials: string[];
  differentiationTips: string;
}

export async function generateLessonPlan(params: {
  subject: string;
  gradeYear: string;
  topic: string;
  duration: number;
  classSize: number;
  previousTopics?: string[];
  objectives?: string[];
}): Promise<GeneratedLessonPlan | null> {
  try {
    const prompt = buildLessonPlanPrompt(params);
    const { model, maxTokens } = TASK_CONFIG.lesson_plan;

    const response = await anthropic.messages.create({
      model,
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = response.content[0]?.type === 'text' ? response.content[0].text : '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    return JSON.parse(jsonMatch[0]) as GeneratedLessonPlan;
  } catch {
    return null;
  }
}
