import { useState, useRef, useEffect } from 'react';
import { Mic, Grid3X3, HelpCircle, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

type InputMode = 'audio' | 'text';

type ChatInputProps = {
  sendTextMessage: (text: string) => void;
  toggleRecording: () => void;
  isRecording: boolean;
}

export function ChatInput({
  sendTextMessage,
  toggleRecording,
  isRecording
}: ChatInputProps) {
  const [mode, setMode] = useState<InputMode>('audio');
  const [textValue, setTextValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (mode === 'text') {
      inputRef.current?.focus();
    }
  }, [mode]);

  const handleSend = () => {
    if (!textValue.trim()) return;
    
    sendTextMessage(textValue.trim());
    setTextValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="flex items-center gap-3 px-5 py-4 bg-background">
      {/* Text switch button */}
      <button
        onClick={() => setMode(mode === 'text' ? 'audio' : 'text')}
        className={cn(
          'flex flex-col items-center gap-1 min-w-[52px] transition-colors',
          mode === 'text'
            ? 'text-primary'
            : 'text-muted-foreground hover:text-foreground',
        )}
        aria-label="Switch to text input"
      >
        <Grid3X3 className="size-5" />
        <span className="text-xs font-medium">Text</span>
      </button>

      {isRecording && <p>Recording...</p>}

      {/* Center: mic or text input */}
      <div className="flex flex-1 items-center justify-center">
        {mode === 'audio' ? (
          <button
            className="flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/90 active:scale-95 transition-all"
            aria-label="Record audio"
            onClick={toggleRecording}
          >
            <Mic className="size-7" />
          </button>
        ) : (
          <div className="flex w-full items-center gap-2 rounded-full bg-input px-4 py-2.5">
            <input
              ref={inputRef}
              type="text"
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message…"
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            />
            <button
              onClick={handleSend}
              disabled={!textValue.trim()}
              className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-40 transition-opacity"
              aria-label="Send message"
            >
              <Send className="size-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Help button */}
      <button
        className="flex flex-col items-center gap-1 min-w-[52px] text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Help"
      >
        <HelpCircle className="size-5" />
        <span className="text-xs font-medium">Help</span>
      </button>
    </div>
  );
}
