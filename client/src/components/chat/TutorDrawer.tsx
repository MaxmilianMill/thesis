import { useState, useRef, useEffect } from 'react';
import { X, Send } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import type { Message } from '@thesis/types';
import type { TutorEntry } from '@/hooks/useTutor';
import {
  Drawer,
  DrawerContent,
  DrawerClose,
} from '@/components/ui/drawer';

type Props = {
  open: boolean;
  onClose: () => void;
  lastMessage: Message | undefined;
  entries: TutorEntry[];
  isLoading: boolean;
  onSendQuestion: (question: string) => void;
};

export function TutorDrawer({ open, onClose, lastMessage, entries, isLoading, onSendQuestion }: Props) {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [entries, isLoading]);

  const handleSend = () => {
    if (!inputValue.trim() || isLoading) return;
    onSendQuestion(inputValue.trim());
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <Drawer open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DrawerContent className="max-h-[90vh] flex flex-col">
        <DrawerClose className="absolute right-4 top-4 z-10 flex size-9 items-center justify-center rounded-full bg-card text-muted-foreground hover:text-foreground transition-colors">
          <X className="size-5" />
        </DrawerClose>

        {lastMessage && (
          <div className="px-5 pt-6 pb-3 shrink-0">
            <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
              {lastMessage.isUser ? 'You said' : 'Partner said'}
            </p>
            <div className="rounded-xl bg-card border border-border px-4 py-3">
              <p className="text-sm text-foreground line-clamp-3">{lastMessage.text}</p>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-5 py-3 flex flex-col gap-4 min-h-0">
          <div className="flex items-start gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary text-sm font-bold">
              B
            </div>
            <div className="rounded-2xl rounded-tl-sm bg-card border border-border px-4 py-3 max-w-[85%]">
              <p className="text-sm text-foreground">
                Hey! I'm your language buddy. What would you like to know about this conversation?
              </p>
            </div>
          </div>

          {entries.map((entry, i) => (
            <div key={i} className="flex flex-col gap-4">
              <div className="flex justify-end">
                <div className="rounded-2xl rounded-tr-sm bg-primary px-4 py-3 max-w-[85%]">
                  <p className="text-sm text-primary-foreground">{entry.question}</p>
                </div>
              </div>

              {entry.response && (
                <div className="flex items-start gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary text-sm font-bold">
                    B
                  </div>
                  <div className="rounded-2xl rounded-tl-sm bg-card border border-border px-4 py-3 max-w-[85%]">
                    {entry.response.response_type === 'md' ? (
                      <div className="tutor-markdown text-sm text-foreground">
                        <ReactMarkdown>{entry.response.response_text}</ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-sm text-foreground">{entry.response.response_text}</p>
                    )}
                    {entry.response.suggested_next_steps.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-border flex flex-col gap-1.5">
                        <p className="text-xs font-medium text-muted-foreground">Try saying:</p>
                        {entry.response.suggested_next_steps.map((step: string, j: number) => (
                          <span key={j} className="text-xs text-primary">
                            {step}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary text-sm font-bold">
                B
              </div>
              <div className="rounded-2xl rounded-tl-sm bg-card border border-border px-4 py-3">
                <div className="flex gap-1.5 items-center h-4">
                  <span className="size-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:0ms]" />
                  <span className="size-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:150ms]" />
                  <span className="size-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Text input */}
        <div className="px-5 py-4 shrink-0 border-t border-border">
          <div className="flex items-center gap-2 rounded-full bg-input px-4 py-2.5">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question…"
              disabled={isLoading}
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none disabled:opacity-40"
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || isLoading}
              className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-40 transition-opacity"
              aria-label="Send question"
            >
              <Send className="size-3.5" />
            </button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
