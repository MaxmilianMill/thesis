import type { Partner } from '@thesis/types';

interface PartnerInfoCardProps {
  partner: Partner;
}

export function PartnerInfoCard({ partner }: PartnerInfoCardProps) {
  return (
    <div className="flex items-center gap-3 flex-1 rounded-lg bg-card border border-border p-3">
      <div className="w-10 h-10 rounded-full bg-accent flex-shrink-0" />
      <div className="flex flex-col gap-0.5">
        <span className="text-sm text-foreground">
          Voice: {partner.voiceConfig.voiceName}
        </span>
        <span className="text-sm text-muted-foreground">
          Personality: {partner.personalityDescription || 'Helpful'}
        </span>
      </div>
    </div>
  );
}
