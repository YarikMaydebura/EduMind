import { db } from '@/lib/db';

import type { ChatMessage } from './student-tutor';

const MAX_MESSAGES_PER_SUBJECT = 20;

interface ConversationStore {
  [subject: string]: ChatMessage[];
}

export async function loadConversationHistory(
  studentId: string,
  subject: string,
): Promise<ChatMessage[]> {
  const profile = await db.studentAiProfile.findUnique({
    where: { studentId },
    select: { conversationContext: true },
  });

  if (!profile?.conversationContext) return [];

  const store = profile.conversationContext as unknown as ConversationStore;
  return store[subject] ?? [];
}

export async function saveConversationHistory(
  studentId: string,
  subject: string,
  messages: ChatMessage[],
): Promise<void> {
  const profile = await db.studentAiProfile.findUnique({
    where: { studentId },
    select: { conversationContext: true },
  });

  const store: ConversationStore = (profile?.conversationContext as unknown as ConversationStore) ?? {};
  store[subject] = messages.slice(-MAX_MESSAGES_PER_SUBJECT);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const jsonStore = JSON.parse(JSON.stringify(store)) as any;
  await db.studentAiProfile.upsert({
    where: { studentId },
    update: { conversationContext: jsonStore },
    create: { studentId, conversationContext: jsonStore },
  });
}

export async function clearConversationHistory(
  studentId: string,
  subject: string,
): Promise<void> {
  const profile = await db.studentAiProfile.findUnique({
    where: { studentId },
    select: { conversationContext: true },
  });

  if (!profile?.conversationContext) return;

  const store = profile.conversationContext as unknown as ConversationStore;
  delete store[subject];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await db.studentAiProfile.update({
    where: { studentId },
    data: { conversationContext: JSON.parse(JSON.stringify(store)) as any },
  });
}
