import { Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FEATURE_OPTIONS } from '@/lib/api/partnerApi';
import type { FeatureType } from '@/lib/api/partnerApi';

interface FeatureButtonProps {
  feature: FeatureType;
  selectedId: string | null;
  onClick: () => void;
}

export function FeatureButton({ feature, selectedId, onClick }: FeatureButtonProps) {
  const selectedOption = selectedId
    ? FEATURE_OPTIONS[feature].find((o) => o.id === selectedId)
    : null;

  const isSkin = feature === 'skin';

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-14 h-14 rounded-full flex items-center justify-center transition-all border-2',
        selectedId
          ? 'border-primary'
          : 'border-border hover:border-primary/60'
      )}
      style={
        isSkin && selectedOption
          ? { backgroundColor: selectedOption.placeholderColor }
          : undefined
      }
    >
      {isSkin && !selectedOption ? (
        <div className="w-8 h-8 rounded-full bg-muted-foreground/30" />
      ) : isSkin && selectedOption ? null : (
        <Eye
          className={cn(
            'w-5 h-5',
            selectedId ? 'text-primary' : 'text-muted-foreground'
          )}
        />
      )}
    </button>
  );
}
