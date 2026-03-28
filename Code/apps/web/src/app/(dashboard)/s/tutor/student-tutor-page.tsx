'use client';

import { Bot, Loader2, Send, Sparkles, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface SubjectOption {
  value: string;
  label: string;
  className: string;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface Props {
  studentName: string;
  subjects: SubjectOption[];
}

const WELCOME_MESSAGE =
  "Hi! I'm your EduMind AI Tutor. I'm here to help you understand concepts and work through problems — but I won't just give you the answers. We'll figure it out together! What would you like to study today? 📚";

export function StudentTutorPage({ studentName, subjects }: Props) {
  const [subject, setSubject] = useState(subjects[0]?.value ?? '');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: WELCOME_MESSAGE },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  async function handleSend() {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: text };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/student/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages,
          subject: subject || 'General',
        }),
      });

      const json = await res.json();
      if (json.success) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: (json.data as { response: string }).response },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: "I'm having trouble connecting right now. Please try again in a moment.",
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: "Something went wrong. Please check your connection and try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  }

  function handleClearChat() {
    setMessages([{ role: 'assistant', content: WELCOME_MESSAGE }]);
  }

  return (
    <div className="container flex h-[calc(100vh-4rem)] max-w-3xl flex-col py-4">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold">EduMind Tutor</h1>
            <p className="text-xs text-muted-foreground">Your personal AI study companion</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {subjects.length > 0 && (
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="rounded-md border bg-background px-2 py-1.5 text-sm"
            >
              {subjects.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          )}
          <Button variant="ghost" size="sm" onClick={handleClearChat}>
            New Chat
          </Button>
        </div>
      </div>

      {/* Messages */}
      <Card className="flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback
                  className={
                    msg.role === 'assistant'
                      ? 'bg-gradient-to-br from-purple-500 to-blue-500 text-white'
                      : 'bg-primary text-primary-foreground'
                  }
                >
                  {msg.role === 'assistant' ? (
                    <Bot className="h-4 w-4" />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                </AvatarFallback>
              </Avatar>

              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-tr-sm'
                    : 'bg-muted rounded-tl-sm'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3">
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-muted px-4 py-3">
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:0ms]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:150ms]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:300ms]" />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="border-t p-3">
          <div className="flex gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Ask me anything about ${subject ? subject.replace(/_/g, ' ') : 'your studies'}...`}
              disabled={isLoading}
              rows={1}
              className="flex-1 resize-none rounded-xl border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
              style={{ minHeight: '40px', maxHeight: '120px' }}
            />
            <Button
              size="icon"
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="h-10 w-10 shrink-0 rounded-xl"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="mt-1.5 text-center text-xs text-muted-foreground">
            Press Enter to send · Shift+Enter for new line
          </p>
        </div>
      </Card>
    </div>
  );
}
