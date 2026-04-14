type Props = {
  scenarioTitle: string;
};

export function PartnerSection({ scenarioTitle }: Props) {
  return (
    <div className="flex flex-col items-center gap-3 px-5 pt-4 pb-2">
      <p className="text-xs font-medium text-muted-foreground tracking-wide">{scenarioTitle}</p>
      <div className="size-20 overflow-hidden rounded-full border-2 border-border bg-accent flex items-center justify-center">
        {/* Partner image placeholder — replace with real image when available */}
        <div className="size-full rounded-full bg-accent" />
      </div>
    </div>
  );
}
