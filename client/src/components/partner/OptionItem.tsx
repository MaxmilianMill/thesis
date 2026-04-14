import { cn } from '@/lib/utils';
import type { FeatureOption } from '@/lib/api/partnerApi';

interface OptionItemProps {
  option: FeatureOption;
  isSelected: boolean;
  onSelect: () => void;
}

export function OptionItem({ option, isSelected, onSelect }: OptionItemProps) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        'flex flex-col items-center gap-2 rounded-xl p-2 transition-all border-2',
        isSelected
          ? 'border-primary bg-accent/20'
          : 'border-transparent hover:border-primary/40 hover:bg-accent/10'
      )}
    >
      <div
        className="w-full aspect-square rounded-lg"
        style={{ backgroundColor: option.placeholderColor }}
      />
      <span className="text-xs text-muted-foreground">{option.label}</span>
    </button>
  );
}
