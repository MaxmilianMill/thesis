import { LevelOption } from '@/components/setup/LevelOption';
import type { Level } from '@thesis/types';

const LEVELS: Array<{ code: Level["code"]; label: string; name: Level["name"]; subtitle: string }> = [
  {
    code: 'a1',
    label: 'A1',
    name: 'beginner',
    subtitle: 'Puedo presentarme y entender frases muy básicas del día a día.',
  },
  {
    code: 'a2',
    label: 'A2',
    name: 'beginner',
    subtitle: 'Puedo comunicarme en situaciones simples y hablar sobre temas cotidianos.',
  },
  {
    code: 'b1',
    label: 'B1',
    name: 'intermediate',
    subtitle: 'Puedo hablar sobre temas conocidos y describir experiencias y planes.',
  },
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
        {LEVELS.map(({ code, label, name, subtitle }) => (
          <LevelOption
            key={code}
            level={label}
            description={label}
            subtitle={subtitle}
            isSelected={selectedLevel?.code === code}
            onSelect={() => onSelect({ name, code })}
          />
        ))}
      </div>
    </div>
  );
}
