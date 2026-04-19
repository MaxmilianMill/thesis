import { InterestChip } from '@/components/setup/InterestChip';

const DIFFICULTIES = [
  'Vocabulary',
  'Verb Conjugations',
  'Fear of Speaking',
  'Grammar Rules',
  'Pronunciation',
  'Listening Comprehension',
  'Reading Speed',
  'Writing',
  'Gendered Nouns',
  'Sentence Structure',
  'Idioms & Expressions',
  'Memory & Retention',
  'Staying Motivated',
  'Finding Practice Partners',
  'Thinking in the Language',
];

const MAX_DIFFICULTIES = 5;

interface DifficultiesStepProps {
  selectedDifficulties: string[];
  onToggle: (difficulty: string) => void;
}

export function DifficultiesStep({ selectedDifficulties, onToggle }: DifficultiesStepProps) {
  const isMaxReached = selectedDifficulties.length >= MAX_DIFFICULTIES;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">What do you struggle with?</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Pick up to {MAX_DIFFICULTIES} areas you find most challenging ({selectedDifficulties.length}/{MAX_DIFFICULTIES} selected)
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {DIFFICULTIES.map((difficulty) => (
          <InterestChip
            key={difficulty}
            interest={difficulty}
            isSelected={selectedDifficulties.includes(difficulty)}
            isDisabled={isMaxReached}
            onToggle={() => onToggle(difficulty)}
          />
        ))}
      </div>
    </div>
  );
}
