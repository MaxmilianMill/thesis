import { CheckCircle } from 'lucide-react';
import type { Message } from '@thesis/types';

type Props = {
  message: Message;
};

export function UserMessage({ message }: Props) {
  return (
    <div className="flex flex-col items-end gap-1 max-w-[75%] self-end">
      <span className="text-xs text-muted-foreground px-1">You</span>
      <div className="flex items-end gap-2">
        {message.isCorrect && (
          <CheckCircle className="size-5 text-success shrink-0 mb-0.5" />
        )}
        <div className="rounded-2xl bg-card px-4 py-3">
          <p className="text-sm text-foreground leading-relaxed">{message.improvedVersion ?? message.text}</p>
        </div>
      </div>
    </div>
  );
}
