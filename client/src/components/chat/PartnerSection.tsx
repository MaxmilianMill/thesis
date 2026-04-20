type Props = {
  scenarioTitle: string;
  onGiveUp?: () => void;
};

export function PartnerSection({ scenarioTitle, onGiveUp }: Props) {
  return (
    <div className="flex flex-col items-center gap-3 px-5 pt-4 pb-2 relative">
      <div className="flex w-full items-center justify-center">
        <p className="text-xs font-medium text-muted-foreground tracking-wide">{scenarioTitle}</p>
        {onGiveUp && (
          <button
            onClick={onGiveUp}
            className="absolute right-5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Give up
          </button>
        )}
      </div>
      <div className="size-20 overflow-hidden rounded-full border-2 border-border bg-accent flex items-center justify-center">
        {/* Partner image placeholder — replace with real image when available */}
        <div className="size-full rounded-full bg-accent" />
      </div>
    </div>
  );
}
