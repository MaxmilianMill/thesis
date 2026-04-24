import { cn } from '@/lib/utils';
import type { FeatureOption } from '@/lib/api/partnerApi';
import dummyAvatar from '@/assets/dummy_avatar.png';

interface FeatureOptionCellProps {
  option: FeatureOption;
  isSelected: boolean;
  onSelect: () => void;
}

export function FeatureOptionCell({ option, isSelected, onSelect }: FeatureOptionCellProps) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        'flex flex-col items-center gap-1 rounded-xl p-1.5 transition-all border-2 flex-1 min-w-0',
        isSelected
          ? 'border-primary bg-accent/20'
          : 'border-transparent hover:border-primary/40 hover:bg-accent/10'
      )}
    >
      <img
        src={dummyAvatar}
        alt={option.label}
        className="w-full aspect-square rounded-lg object-cover"
      />
      <span className="text-xs text-muted-foreground truncate w-full text-center leading-tight">
        {option.label}
      </span>
    </button>
  );
}
