import { useState, useCallback } from 'react';
import type { UserInfo } from '@thesis/types';
import { generateTutorResponse } from '@/lib/api/tutorApi';
import { useChatSelectors } from '@/contexts/useChatStore';

export function useTutor(userInfo: UserInfo | undefined, chatId: string | undefined) {
  const [isLoading, setIsLoading] = useState(false);

  const history = useChatSelectors.use.history();
  const isTutorMode = useChatSelectors.use.isTutorMode();
  const setTutorMode = useChatSelectors.use.setTutorMode();
  const addTutorMessage = useChatSelectors.use.addTutorMessage();
  const resolveTutorQuestion = useChatSelectors.use.resolveTutorQuestion();

  const toggleTutorMode = useCallback(() => setTutorMode(!isTutorMode), [isTutorMode, setTutorMode]);

  const sendQuestion = useCallback(
    async (question: string) => {
      if (!userInfo || !question.trim() || !chatId || isLoading) return;

      const questionId = crypto.randomUUID();
      addTutorMessage(question, questionId);
      setIsLoading(true);

      const nonTutorHistory = history.filter((m) => !m.isTutor);

      try {
        const response = await generateTutorResponse({
          userInfo,
          chatId,
          question,
          history: nonTutorHistory,
        });
        resolveTutorQuestion(questionId, response);
      } catch (err) {
        console.error('Tutor error:', err);
        resolveTutorQuestion(questionId, 'error');
      } finally {
        setIsLoading(false);
      }
    },
    [userInfo, chatId, isLoading, history, addTutorMessage, resolveTutorQuestion]
  );

  return {
    isTutorMode,
    toggleTutorMode,
    isLoading,
    sendQuestion,
  };
}
