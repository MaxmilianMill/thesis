import { useState, useRef, useEffect } from 'react';
import { Mic, Grid3X3, HelpCircle, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RecordingButton } from './RecordingButton';

type InputMode = 'audio' | 'text';

type ChatInputProps = {
  sendTextMessage: (text: string) => void;
  toggleRecording: () => void;
  isRecording: boolean;
  onHelpPress: () => void;
  disabled?: boolean;
  isConnected?: boolean;
}

export function ChatInput({
  sendTextMessage,
  toggleRecording,
  isRecording,
  onHelpPress,
  disabled = false,
  isConnected = true,
}: ChatInputProps) {
  const inputDisabled = disabled || !isConnected;
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
    <div className="flex flex-col bg-background">
      {!isConnected && (
        <div className="px-5 pt-2 text-center text-xs text-muted-foreground">
          Reconnecting…
        </div>
      )}
      <div className="flex items-center gap-3 px-5 py-4">
      {/* Text switch button */}
      <button
        onClick={() => setMode(mode === 'text' ? 'audio' : 'text')}
        disabled={inputDisabled}
        className={cn(
          'flex flex-col items-center gap-1 min-w-[52px] transition-colors disabled:opacity-40 disabled:pointer-events-none',
          mode === 'text'
            ? 'text-primary'
            : 'text-muted-foreground hover:text-foreground',
        )}
        aria-label="Switch to text input"
      >
        <Grid3X3 className="size-5" />
        <span className="text-xs font-medium">Text</span>
      </button>

      {/* Center: mic or text input */}
      <div className="flex flex-1 items-center justify-center">
        {mode === 'audio' ? (
          isRecording ? (
            <RecordingButton onStop={toggleRecording} />
          ) : (
            <button
              className="flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/90 active:scale-95 transition-all disabled:opacity-40 disabled:pointer-events-none"
              aria-label="Record audio"
              onClick={toggleRecording}
              disabled={inputDisabled}
            >
              <Mic className="size-7" />
            </button>
          )
        ) : (
          <div className="flex w-full items-center gap-2 rounded-full bg-input px-4 py-2.5">
            <input
              ref={inputRef}
              type="text"
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message…"
              disabled={inputDisabled}
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none disabled:opacity-40"
            />
            <button
              onClick={handleSend}
              disabled={!textValue.trim() || inputDisabled}
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
        onClick={onHelpPress}
        className="flex flex-col items-center gap-1 min-w-[52px] text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Help"
      >
        <HelpCircle className="size-5" />
        <span className="text-xs font-medium">Help</span>
      </button>
      </div>
    </div>
  );
}
