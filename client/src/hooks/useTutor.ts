import { useState, useCallback, useRef, useEffect } from 'react';
import type { Message, TutorResponse, UserInfo } from '@thesis/types';
import { generateTutorResponse } from '@/lib/api/tutorApi';

export type TutorEntry = {
  question: string;
  response?: TutorResponse;
};

export function useTutor(history: Message[], userInfo: UserInfo | undefined) {
  const [isOpen, setIsOpen] = useState(false);
  const [entries, setEntries] = useState<TutorEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const lastAIMessageId = useRef<string | undefined>(undefined);

  // Reset tutor conversation when a new AI partner message arrives
  useEffect(() => {
    const lastAIMessage = [...history].reverse().find((m) => !m.isUser);
    if (lastAIMessage?.id && lastAIMessage.id !== lastAIMessageId.current) {
      lastAIMessageId.current = lastAIMessage.id;
      setEntries([]);
    }
  }, [history]);

  const openTutor = useCallback(() => setIsOpen(true), []);
  const closeTutor = useCallback(() => setIsOpen(false), []);

  const sendQuestion = useCallback(
    async (question: string) => {
      if (!userInfo || !question.trim()) return;

      const newEntry: TutorEntry = { question };
      setEntries((prev) => [...prev, newEntry]);
      setIsLoading(true);

      try {
        const response = await generateTutorResponse({
          userInfo,
          question,
          history: history as Message[],
        });
        setEntries((prev) =>
          prev.map((e, i) => (i === prev.length - 1 ? { ...e, response } : e))
        );
      } catch (err) {
        console.error('Tutor error:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [userInfo, history]
  );

  const lastMessage = history[history.length - 1] as Message | undefined;

  return {
    isOpen,
    openTutor,
    closeTutor,
    entries,
    isLoading,
    sendQuestion,
    lastMessage,
  };
}
