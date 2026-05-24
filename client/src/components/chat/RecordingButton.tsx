import { WaveAnimation } from './WaveAnimation';

type Props = {
  onStop: () => void;
};

export function RecordingButton({ onStop }: Props) {
  return (
    <button
      onClick={onStop}
      aria-label="Stop recording"
      className="animate-in zoom-in-75 duration-300 flex w-full items-center justify-between gap-4 rounded-full bg-primary px-5 py-4 text-primary-foreground shadow-lg shadow-primary/30 active:scale-95 transition-transform"
    >
      <WaveAnimation />
      <span className="text-sm font-semibold">Stop</span>
    </button>
  );
}
