import { cn } from '@/lib/utils';

interface LevelOptionProps {
  level: string;
  description: string;
  subtitle?: string;
  isSelected: boolean;
  onSelect: () => void;
}

export function LevelOption({ level, description, subtitle, isSelected, onSelect }: LevelOptionProps) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        'flex w-full items-start gap-4 rounded-lg border px-4 py-3 text-left transition-colors',
        isSelected
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-border bg-card text-foreground hover:border-primary/60 hover:bg-accent/20'
      )}
    >
      <span className="w-8 shrink-0 text-lg font-bold mt-0.5">{level}</span>
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium">{description}</span>
        {subtitle && (
          <span className={cn('text-xs', isSelected ? 'text-primary-foreground/70' : 'text-muted-foreground')}>
            {subtitle}
          </span>
        )}
      </div>
    </button>
  );
}
