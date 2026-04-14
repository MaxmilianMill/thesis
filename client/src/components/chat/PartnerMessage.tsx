import type { Message } from '@thesis/types';

type Props = {
  message: Message;
  partnerName: string;
};

export function PartnerMessage({ message, partnerName }: Props) {
  return (
    <div className="flex flex-col items-start gap-1 max-w-[75%]">
      <span className="text-xs text-muted-foreground px-1">{partnerName}</span>
      <p className="text-sm text-foreground leading-relaxed">{message.text}</p>
    </div>
  );
}
