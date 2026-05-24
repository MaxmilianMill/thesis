import { LevelOption } from '@/components/setup/LevelOption';
import type { Gender } from '@thesis/types';

const GENDERS: Array<{ value: Gender; code: string; label: string; subtitle: string }> = [
  { value: 'male', code: 'M', label: 'Male', subtitle: 'He / Him' },
  { value: 'female', code: 'F', label: 'Female', subtitle: 'She / Her' },
  { value: 'diverse', code: 'D', label: 'Diverse', subtitle: 'They / Them' },
];

interface GenderStepProps {
  selectedGender: Gender | undefined;
  onSelect: (gender: Gender) => void;
}

export function GenderStep({ selectedGender, onSelect }: GenderStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">What is your gender?</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Select the option that best describes you
        </p>
      </div>
      <div className="space-y-3">
        {GENDERS.map(({ value, code, label, subtitle }) => (
          <LevelOption
            key={value}
            level={code}
            description={label}
            subtitle={subtitle}
            isSelected={selectedGender === value}
            onSelect={() => onSelect(value)}
          />
        ))}
      </div>
    </div>
  );
}
