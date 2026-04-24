import { FeatureRow } from './FeatureRow';
import type { FeatureType } from '@/lib/api/partnerApi';

const FEATURE_ORDER: FeatureType[] = ['skin', 'hair', 'eyes', 'nose', 'mouth'];

type Selections = Record<FeatureType, string | null>;

interface FeaturePickerProps {
  selections: Selections;
  activeFeature: FeatureType | null;
  onActivate: (feature: FeatureType | null) => void;
  onSelect: (feature: FeatureType, optionId: string) => void;
}

export function FeaturePicker({ selections, activeFeature, onActivate, onSelect }: FeaturePickerProps) {
  return (
    <div className="flex flex-col gap-2">
      {FEATURE_ORDER.map((feature) => (
        <FeatureRow
          key={feature}
          feature={feature}
          selectedId={selections[feature]}
          isExpanded={activeFeature === feature}
          onExpand={() => onActivate(feature)}
          onCollapse={() => onActivate(null)}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
