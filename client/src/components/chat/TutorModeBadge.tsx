export function TutorModeBadge() {
  return (
    <div className="px-5 pt-2 flex items-center gap-2">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-primary">
        <span className="size-1.5 rounded-full bg-primary animate-pulse" />
        Tutor Mode
      </span>
      <span className="text-xs text-muted-foreground">Ask anything about this conversation</span>
    </div>
  );
}
