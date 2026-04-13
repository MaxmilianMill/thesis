import { cn } from '@/lib/utils';

interface InterestChipProps {
  interest: string;
  isSelected: boolean;
  isDisabled: boolean;
  onToggle: () => void;
}

export function InterestChip({ interest, isSelected, isDisabled, onToggle }: InterestChipProps) {
  return (
    <button
      onClick={onToggle}
      disabled={isDisabled && !isSelected}
      className={cn(
        'rounded-full border px-4 py-2 text-sm font-medium transition-colors',
        isSelected
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-border bg-card text-muted-foreground hover:border-primary/60 hover:text-foreground',
        isDisabled && !isSelected && 'cursor-not-allowed opacity-40'
      )}
    >
      {interest}
    </button>
  );
}
