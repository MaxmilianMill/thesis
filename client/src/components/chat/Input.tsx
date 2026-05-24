import { useState, useRef, useEffect } from 'react';
import { Mic, Grid3X3, HelpCircle, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RecordingButton } from './RecordingButton';
import { TutorModeBadge } from './TutorModeBadge';

type InputMode = 'audio' | 'text';

type ChatInputProps = {
  sendTextMessage: (text: string) => void;
  toggleRecording: () => void;
  isRecording: boolean;
  onHelpPress: () => void;
  isTutorMode: boolean;
  onTutorSend: (text: string) => void;
  isTutorLoading: boolean;
  disabled?: boolean;
  isConnected?: boolean;
}

export function ChatInput({
  sendTextMessage,
  toggleRecording,
  isRecording,
  onHelpPress,
  isTutorMode,
  onTutorSend,
  isTutorLoading,
  disabled = false,
  isConnected = true,
}: ChatInputProps) {
  const inputDisabled = disabled || !isConnected;
  const [mode, setMode] = useState<InputMode>('audio');
  const [textValue, setTextValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const effectiveMode: InputMode = isTutorMode ? 'text' : mode;

  useEffect(() => {
    if (effectiveMode === 'text') {
      inputRef.current?.focus();
    }
  }, [effectiveMode]);

  const handleSend = () => {
    if (!textValue.trim()) return;
    if (isTutorMode) {
      onTutorSend(textValue.trim());
    } else {
      sendTextMessage(textValue.trim());
    }
    setTextValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSend();
  };

  const sendDisabled = !textValue.trim() || inputDisabled || (isTutorMode && isTutorLoading);

  return (
    <div className="flex flex-col bg-background">
      {!isConnected && (
        <div className="px-5 pt-2 text-center text-xs text-muted-foreground">
          Reconnecting…
        </div>
      )}
      {isTutorMode && <TutorModeBadge />}
      <div className="flex items-center gap-3 px-5 py-4">
        {!isTutorMode && (
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
        )}

        {isTutorMode && <div className="min-w-[52px]" />}

        <div className="flex flex-1 items-center justify-center">
          {effectiveMode === 'audio' ? (
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
                placeholder={isTutorMode ? 'Ask the tutor…' : 'Type a message…'}
                disabled={inputDisabled || (isTutorMode && isTutorLoading)}
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none disabled:opacity-40"
              />
              <button
                onClick={handleSend}
                disabled={sendDisabled}
                className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-40 transition-opacity"
                aria-label="Send message"
              >
                <Send className="size-3.5" />
              </button>
            </div>
          )}
        </div>

        <button
          onClick={onHelpPress}
          className={cn(
            'flex flex-col items-center gap-1 min-w-[52px] transition-colors',
            isTutorMode
              ? 'text-primary'
              : 'text-muted-foreground hover:text-foreground',
          )}
          aria-label="Help"
        >
          {isTutorMode ? <><HelpCircle className="size-5" />
          <span className="text-xs font-medium">Help</span></> : 
          <><HelpCircle className="size-5" />
          <span className="text-xs font-medium">Help</span></>}
        </button>
      </div>
    </div>
  );
}
