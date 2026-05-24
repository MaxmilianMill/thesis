import { useEffect, useRef } from 'react';
import type { UIMessage } from '@/contexts/useChatStore';
import { PartnerMessage } from './PartnerMessage';
import { UserMessage } from './UserMessage';
import { TutorMessage } from './TutorMessage';

type Props = {
  messages: UIMessage[];
  partnerName: string;
  isTutorMode: boolean;
};

export function MessageList({ messages, partnerName, isTutorMode }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  const chatMessages = messages.filter((m) => !m.isTutor);
  const lastTwo = chatMessages.slice(-2);

  const lastChatIdx = messages.reduce((acc, m, i) => (!m.isTutor ? i : acc), -1);
  const activeTutorMessages =
    lastChatIdx >= 0
      ? messages.slice(lastChatIdx + 1).filter((m) => m.isTutor)
      : messages.filter((m) => m.isTutor);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col gap-6 px-5 py-6 w-full flex-1 overflow-y-auto">
      {lastTwo.map((message) =>
        message.isUser ? (
          <UserMessage key={message.id} message={message} />
        ) : (
          <PartnerMessage key={message.id} message={message} partnerName={partnerName} />
        ),
      )}
      {isTutorMode && activeTutorMessages.map((message) => (
        <TutorMessage key={message.id} message={message} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
