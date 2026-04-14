import { LevelOption } from '@/components/setup/LevelOption';

const LEVELS = [
  { level: 'A1', description: 'Beginner – I know a few words and basic greetings.', key: "" },
  { level: 'A2', description: 'Elementary – I can handle simple, routine conversations.' },
  { level: 'B1', description: 'Intermediate – I can discuss familiar topics and express opinions.' },
];

interface LevelStepProps {
  selectedLevel: string | null;
  onSelect: (level: string) => void;
}

export function LevelStep({ selectedLevel, onSelect }: LevelStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">What is your language level?</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Select your current CEFR proficiency level
        </p>
      </div>
      <div className="space-y-3">
        {LEVELS.map(({ level, description }) => (
          <LevelOption
            key={level}
            level={level}
            description={description}
            isSelected={selectedLevel === level}
            onSelect={() => onSelect(level)}
          />
        ))}
      </div>
    </div>
  );
}
