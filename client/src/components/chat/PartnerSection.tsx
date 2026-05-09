import { useSetupSelectors } from '@/contexts/useSetupStore';

const FEATURE_ORDER = ['skin', 'hair', 'eyes', 'nose', 'mouth'] as const;

type FeatureKey = typeof FEATURE_ORDER[number];

function getFeatureValue(partner: Record<string, string>, feature: FeatureKey): string | undefined {
  return feature === 'skin' ? partner.color : partner[feature];
}

type Props = {
  scenarioTitle: string;
  onGiveUp?: () => void;
  isWarmup: boolean;
};

export function PartnerSection({ scenarioTitle, onGiveUp, isWarmup }: Props) {
  const userInfo = useSetupSelectors.use.userInfo();
  const partner = userInfo?.partner;

  return (
    <div className="flex flex-col items-center gap-3 px-5 pt-4 pb-2 relative">
      <div className="flex w-full items-center justify-center">
        <p className="text-xs font-medium text-muted-foreground tracking-wide">{isWarmup ? "Warmup Chat: " : "" + scenarioTitle}</p>
        {onGiveUp && (
          <button
            onClick={onGiveUp}
            className="absolute right-5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Give up
          </button>
        )}
      </div>
      <div className="relative size-20 overflow-hidden rounded-full border-2 border-border bg-accent">
        {partner && FEATURE_ORDER.map((feature) => {
          const value = getFeatureValue(partner as Record<string, string>, feature);
          return value ? (
            <img
              key={feature}
              src={`/partner/${value}.svg`}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : null;
        })}
      </div>
    </div>
  );
}
