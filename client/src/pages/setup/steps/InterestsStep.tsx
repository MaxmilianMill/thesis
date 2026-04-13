import { InterestChip } from '@/components/setup/InterestChip';

const INTERESTS = [
  'Travel',
  'Music',
  'Sports',
  'Food & Cooking',
  'Movies & TV',
  'Books & Literature',
  'Technology',
  'Business',
  'Art & Culture',
  'Nature',
  'History',
  'Fashion',
  'Science',
  'Gaming',
  'Health & Fitness',
];

const MAX_INTERESTS = 5;

interface InterestsStepProps {
  selectedInterests: string[];
  onToggle: (interest: string) => void;
}

export function InterestsStep({ selectedInterests, onToggle }: InterestsStepProps) {
  const isMaxReached = selectedInterests.length >= MAX_INTERESTS;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">What are your interests?</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Select up to {MAX_INTERESTS} topics you enjoy ({selectedInterests.length}/{MAX_INTERESTS} selected)
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {INTERESTS.map((interest) => (
          <InterestChip
            key={interest}
            interest={interest}
            isSelected={selectedInterests.includes(interest)}
            isDisabled={isMaxReached}
            onToggle={() => onToggle(interest)}
          />
        ))}
      </div>
    </div>
  );
}
