import type { Message } from '@thesis/types';
import { PartnerMessage } from './PartnerMessage';
import { UserMessage } from './UserMessage';

type Props = {
  messages: Message[];
  partnerName: string;
};

export function MessageList({ messages, partnerName }: Props) {
  const lastTwo = messages.slice(-2);

  return (
    <div className="flex flex-col gap-6 px-5 py-6">
      {lastTwo.map((message) =>
        message.isUser ? (
          <UserMessage key={message.id} message={message} />
        ) : (
          <PartnerMessage key={message.id} message={message} partnerName={partnerName} />
        ),
      )}
    </div>
  );
}
