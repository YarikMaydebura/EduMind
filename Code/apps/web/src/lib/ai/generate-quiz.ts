import { anthropic } from './client';
import type { AiUsage } from './config';
import { TASK_CONFIG } from './config';
import { buildQuizPrompt } from './prompts';

export type QuestionType = 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'SHORT_ANSWER';
export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

export interface GeneratedQuestion {
  text: string;
  type: QuestionType;
  options: string[];
  correctAnswer: string;
  explanation: string;
  points: number;
}

export async function generateQuiz(params: {
  subject: string;
  gradeYear: string;
  topic: string;
  numQuestions: number;
  difficulty: Difficulty;
  questionTypes: QuestionType[];
}): Promise<{ questions: GeneratedQuestion[]; usage: AiUsage } | null> {
  try {
    const prompt = buildQuizPrompt(params);
    const { model, maxTokens } = TASK_CONFIG.quiz_generation;

    const response = await anthropic.messages.create({
      model,
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = response.content[0]?.type === 'text' ? response.content[0].text : '';
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return null;

    const questions = (JSON.parse(jsonMatch[0]) as GeneratedQuestion[]).slice(0, params.numQuestions);
    return {
      questions,
      usage: {
        input_tokens: response.usage.input_tokens,
        output_tokens: response.usage.output_tokens,
      },
    };
  } catch {
    return null;
  }
}
