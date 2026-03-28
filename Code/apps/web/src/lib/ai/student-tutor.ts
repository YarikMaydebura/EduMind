import { anthropic } from './client';
import { TASK_CONFIG } from './config';
import { buildStudentTutorSystemPrompt } from './prompts';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const BLOCKED_PATTERNS = [
  /give me the answer/i,
  /just tell me the answer/i,
  /solve this for me/i,
  /do my homework/i,
  /write my essay/i,
  /cheat/i,
];

export function isBlockedMessage(message: string): boolean {
  return BLOCKED_PATTERNS.some((pattern) => pattern.test(message));
}

export async function studentTutor(params: {
  messages: ChatMessage[];
  subject: string;
  studentName: string;
  studentLevel: number;
}): Promise<{ response: string } | null> {
  try {
    const lastMessage = params.messages[params.messages.length - 1]?.content ?? '';

    if (isBlockedMessage(lastMessage)) {
      return {
        response:
          "I'm here to help you learn, not just give you answers! Let's work through this together. What part are you finding tricky? 😊",
      };
    }

    const systemPrompt = buildStudentTutorSystemPrompt({
      subject: params.subject,
      studentName: params.studentName,
      studentLevel: params.studentLevel,
    });

    const { model, maxTokens } = TASK_CONFIG.student_qa;

    const response = await anthropic.messages.create({
      model,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: params.messages.map((m) => ({ role: m.role, content: m.content })),
    });

    const text = response.content[0]?.type === 'text' ? response.content[0].text : '';
    return { response: text };
  } catch {
    return null;
  }
}
