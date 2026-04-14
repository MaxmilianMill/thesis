import { FeatureButton } from './FeatureButton';
import type { FeatureType } from '@/lib/api/partnerApi';

const FEATURE_ORDER: FeatureType[] = ['skin', 'hair', 'eyes', 'nose', 'mouth'];

type Selections = Record<FeatureType, string | null>;

interface FeaturePickerProps {
  selections: Selections;
  onOpen: (feature: FeatureType) => void;
}

export function FeaturePicker({ selections, onOpen }: FeaturePickerProps) {
  return (
    <div className="flex items-center justify-center gap-3 py-2">
      {FEATURE_ORDER.map((feature) => (
        <FeatureButton
          key={feature}
          feature={feature}
          selectedId={selections[feature]}
          onClick={() => onOpen(feature)}
        />
      ))}
    </div>
  );
}
