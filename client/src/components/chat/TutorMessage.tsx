import ReactMarkdown from 'react-markdown';
import type { UIMessage } from '@/contexts/useChatStore';

type Props = {
  message: UIMessage;
  isLoading?: boolean;
};

function TutorPill() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-medium text-primary mb-1.5">
      <span className="size-1 rounded-full bg-primary" />
      Tutor
    </span>
  );
}

function LoadingDots() {
  return (
    <div className="flex gap-1.5 items-center h-4">
      <span className="size-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:0ms]" />
      <span className="size-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:150ms]" />
      <span className="size-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:300ms]" />
    </div>
  );
}

export function TutorMessage({ message, isLoading }: Props) {
  const UserText = () => (
    <div className="flex flex-col items-end">
      <TutorPill />
      <div className="rounded-2xl rounded-tr-sm bg-primary/20 border border-primary/30 px-4 py-3 max-w-[85%]">
        <p className="text-sm text-foreground">{message.text}</p>
      </div>
    </div>
  );

  const response = message.tutorResponse;

  const TutorText = () => (
    <div className="flex flex-col items-start">
      <TutorPill />
      <div className="rounded-2xl rounded-tl-sm bg-card border border-primary/20 px-4 py-3 max-w-[85%]">
        {isLoading || !response ? (
          <LoadingDots />
        ) : (
          <>
            {response.response_type === 'md' ? (
              <div className="tutor-markdown text-sm text-foreground">
                <ReactMarkdown>{response.response_text}</ReactMarkdown>
              </div>
            ) : (
              <p className="text-sm text-foreground">{response.response_text}</p>
            )}
            {response.suggested_next_steps.length > 0 && (
              <div className="mt-3 pt-3 border-t border-border flex flex-col gap-1.5">
                <p className="text-xs font-medium text-muted-foreground">Try saying:</p>
                {response.suggested_next_steps.map((step: string, i: number) => (
                  <span key={i} className="text-xs text-primary">{step}</span>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );

  return (
    <>
      {UserText()}
      {TutorText()}
    </>
  )
}
