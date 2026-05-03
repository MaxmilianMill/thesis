import { CheckCircle } from 'lucide-react';
import type { Message } from '@thesis/types';

type Props = {
  message: Message;
};

function renderWithHighlights(text: string) {
  const parts = text.split(/(\[[^\]]*\])/g);
  return parts.map((part, i) => {
    if (part.startsWith('[') && part.endsWith(']')) {
      return (
        <span key={i} className="text-red-500 font-bold">
          {part.slice(1, -1)}
        </span>
      );
    }
    return part;
  });
}

export function UserMessage({ message }: Props) {
  const content = message.improvedVersion ?? message.text;

  return (
    <div className="flex flex-col items-end gap-1 max-w-[75%] self-end">
      <span className="text-xs text-muted-foreground px-1">You</span>
      <div className="flex items-end gap-2">
        {message.isCorrect && (
          <CheckCircle className="size-5 text-success shrink-0 mb-0.5" />
        )}
        <div className="rounded-2xl bg-card px-4 py-3">
          <p className="text-sm text-foreground leading-relaxed">{renderWithHighlights(content)}</p>
        </div>
      </div>
    </div>
  );
}
