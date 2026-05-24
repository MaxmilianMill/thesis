import { LevelOption } from '@/components/setup/LevelOption';
import type { Level } from '@thesis/types';

const LEVELS: Array<{ 
  code: Level["code"]; 
  label: string; 
  name: Level["name"]; 
  subtitle: string;
  canDo?: string[];
}> = [
  {
    code: 'a1',
    label: 'A1',
    name: 'beginner',
    subtitle: 'I can use basic phrases, introduce myself, and answer simple questions about where I live.',
    canDo: [
      'Introduce myself and others.',
      'Ask and answer simple questions about personal details (e.g., where I live).',
      'Interact in a simple way if the other person talks slowly and clearly.'
    ]
  },
  {
    code: 'a2',
    label: 'A2',
    name: 'beginner',
    subtitle: 'I can communicate in routine tasks and have short social exchanges about family and shopping.',
    canDo: [
      'Understand sentences about basic personal and family information, shopping, etc.',
      'Communicate in simple, everyday tasks requiring a direct exchange of information.',
      'Describe my background and immediate environment in simple terms.'
    ]
  },
  {
    code: 'b1',
    label: 'B1',
    name: 'intermediate',
    subtitle: 'I can handle most travel situations, produce simple texts, and describe experiences and plans.',
    canDo: [
      'Understand the main points of clear standard input on familiar matters like work, school, and leisure.',
      'Deal with most situations likely to arise while traveling.',
      'Produce simple connected text on topics that are familiar or of personal interest.',
      'Describe experiences and events, dreams, hopes, and ambitions.'
    ]
  },
  {
    code: 'b2',
    label: 'B2',
    name: 'intermediate', 
    subtitle: 'I can understand complex texts and interact with native speakers with fluency and spontaneity.',
    canDo: [
      'Understand the main ideas of complex text on both concrete and abstract topics.',
      'Interact with a degree of fluency that makes regular conversation with native speakers easy.',
      'Produce clear, detailed text on a wide range of subjects.',
      'Explain a viewpoint on a topical issue, giving advantages and disadvantages.'
    ]
  },
  {
    code: 'c1',
    label: 'C1',
    name: 'advanced',
    subtitle: 'I can express myself fluently and use the language flexibly for social, academic, and professional purposes.',
    canDo: [
      'Understand a wide range of demanding, longer texts, and recognize implicit meaning.',
      'Express myself fluently and spontaneously without obviously searching for words.',
      'Use language flexibly and effectively for social, academic, and professional purposes.',
      'Produce clear, well-structured, detailed text on complex subjects.'
    ]
  }
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
        {LEVELS.map(({ code, label, name, subtitle, canDo }) => (
          <LevelOption
            key={code}
            level={label}
            description={label}
            subtitle={subtitle}
            canDo={canDo}
            isSelected={selectedLevel?.code === code}
            onSelect={() => onSelect({ name, code } as Level)}
          />
        ))}
      </div>
    </div>
  );
}
