import { cn } from '@/lib/utils';

interface LevelOptionProps {
  level: string;
  description: string;
  isSelected: boolean;
  onSelect: () => void;
}

export function LevelOption({ level, description, isSelected, onSelect }: LevelOptionProps) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        'flex w-full items-center gap-4 rounded-lg border px-4 py-3 text-left transition-colors',
        isSelected
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-border bg-card text-foreground hover:border-primary/60 hover:bg-accent/20'
      )}
    >
      <span className="w-8 text-lg font-bold">{level}</span>
      <span className={cn('text-sm', isSelected ? 'text-primary-foreground/80' : 'text-muted-foreground')}>
        {description}
      </span>
    </button>
  );
}
