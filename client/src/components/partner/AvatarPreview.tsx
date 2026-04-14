import { FEATURE_OPTIONS } from '@/lib/api/partnerApi';
import type { FeatureType } from '@/lib/api/partnerApi';

type Selections = Record<FeatureType, string | null>;

interface AvatarPreviewProps {
  selections: Selections;
}

export function AvatarPreview({ selections }: AvatarPreviewProps) {
  const skinOption = selections.skin
    ? FEATURE_OPTIONS.skin.find((o) => o.id === selections.skin)
    : null;

  const avatarColor = skinOption?.placeholderColor ?? 'hsl(var(--accent))';

  return (
    <div className="flex justify-center py-4">
      <div
        className="relative w-36 h-36 md:w-44 md:h-44 rounded-full"
        style={{ backgroundColor: avatarColor }}
      >
        {/* each feature layer is overlaid here once real images are available */}
      </div>
    </div>
  );
}
