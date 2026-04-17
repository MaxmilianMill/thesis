import { LevelOption } from '@/components/setup/LevelOption';
import type { Level } from '@thesis/types';

const LEVELS = [
  { code: "a1", level: 'A1', description: 'Beginner – I know a few words and basic greetings.', key: "" },
  { code: "a2", level: 'A2', description: 'Elementary – I can handle simple, routine conversations.' },
];

interface LevelStepProps {
  selectedLevel: Level | null;
  onSelect: (level: Level) => void;
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
        {LEVELS.map(({ code, level, description }) => (
          <LevelOption
            key={level}
            level={level}
            description={description}
            isSelected={selectedLevel?.code === code}
            onSelect={() => onSelect({name: "beginner", code: code as Level["code"]})}
          />
        ))}
      </div>
    </div>
  );
}
