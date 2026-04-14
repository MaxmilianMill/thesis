import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { OptionItem } from './OptionItem';
import { FEATURE_OPTIONS } from '@/lib/api/partnerApi';
import type { FeatureType } from '@/lib/api/partnerApi';

const FEATURE_LABELS: Record<FeatureType, string> = {
  skin: 'Skin Color',
  hair: 'Hat / Hair',
  eyes: 'Eyes',
  nose: 'Nose',
  mouth: 'Mouth',
};

interface OptionDrawerProps {
  feature: FeatureType | null;
  selectedId: string | null;
  onSelect: (feature: FeatureType, optionId: string) => void;
  onClose: () => void;
}

export function OptionDrawer({ feature, selectedId, onSelect, onClose }: OptionDrawerProps) {
  const options = feature ? FEATURE_OPTIONS[feature] : [];

  return (
    <Drawer open={feature !== null} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{feature ? FEATURE_LABELS[feature] : ''}</DrawerTitle>
        </DrawerHeader>
        <div className="grid grid-cols-3 gap-3 p-4 pb-8">
          {options.map((option) => (
            <OptionItem
              key={option.id}
              option={option}
              isSelected={selectedId === option.id}
              onSelect={() => feature && onSelect(feature, option.id)}
            />
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
