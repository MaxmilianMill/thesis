import type { FeatureType } from '@/lib/api/partnerApi';
import dummyAvatar from '@/assets/dummy_avatar.png';

const FEATURE_ORDER: FeatureType[] = ['skin', 'hair', 'eyes', 'nose', 'mouth'];

type Selections = Record<FeatureType, string | null>;

interface AvatarPreviewProps {
  selections: Selections;
}

export function AvatarPreview({ selections }: AvatarPreviewProps) {
  const hasAnySelection = FEATURE_ORDER.some((f) => selections[f] !== null);

  return (
    <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-accent/20 border-2 border-border">
      {hasAnySelection ? (
        FEATURE_ORDER.map((feature) =>
          selections[feature] !== null ? (
            <img
              key={feature}
              src={dummyAvatar}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : null
        )
      ) : (
        <img
          src={dummyAvatar}
          alt="Partner preview"
          className="w-full h-full object-cover opacity-40"
        />
      )}
    </div>
  );
}
