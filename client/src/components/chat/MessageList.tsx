import type { UIMessage } from '@/contexts/useChatStore';
import { PartnerMessage } from './PartnerMessage';
import { UserMessage } from './UserMessage';
import { TutorMessage } from './TutorMessage';

type Props = {
  messages: UIMessage[];
  partnerName: string;
  isTutorLoading: boolean;
  isTutorMode: boolean;
};

export function MessageList({ messages, partnerName, isTutorLoading, isTutorMode }: Props) {
  const chatMessages = messages.filter((m) => !m.isTutor);
  const lastTwo = chatMessages.slice(-2);

  const lastChatIdx = messages.reduce((acc, m, i) => (!m.isTutor ? i : acc), -1);
  const activeTutorMessages =
    lastChatIdx >= 0
      ? messages.slice(lastChatIdx + 1).filter((m) => m.isTutor)
      : messages.filter((m) => m.isTutor);

    console.log(activeTutorMessages)

  const showTutorLoading =
    isTutorLoading && activeTutorMessages.at(-1)?.isUser === true;

  return (
    <div className="flex flex-col gap-6 px-5 py-6 w-full">
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
      {showTutorLoading && (
        <TutorMessage
          message={{ id: '__loading', isUser: false, isTutor: true, text: '', uid: '', createdAt: new Date() }}
          isLoading
        />
      )}
    </div>
  );
}
