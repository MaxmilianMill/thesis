import { useState } from 'react';
import { cn } from '@/lib/utils';
import { LevelOption } from '@/components/setup/LevelOption';
import type { Mothertongue } from '@thesis/types';

const MAIN_LANGUAGES: Mothertongue[] = [
  { code: 'de', name: 'German' },
  { code: 'en', name: 'English' },
];

const OTHER_LANGUAGES: Mothertongue[] = [
  { code: 'zh', name: 'Mandarin Chinese' },
  { code: 'hi', name: 'Hindi' },
  { code: 'fr', name: 'French' },
  { code: 'ar', name: 'Arabic' },
  { code: 'bn', name: 'Bengali' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'ur', name: 'Urdu' },
  { code: 'id', name: 'Indonesian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'tr', name: 'Turkish' },
  { code: 'ko', name: 'Korean' },
  { code: 'it', name: 'Italian' },
  { code: 'vi', name: 'Vietnamese' },
  { code: 'pl', name: 'Polish' },
  { code: 'nl', name: 'Dutch' },
  { code: 'th', name: 'Thai' },
  { code: 'el', name: 'Greek' },
  { code: 'ro', name: 'Romanian' },
  { code: 'cs', name: 'Czech' },
  { code: 'sv', name: 'Swedish' },
  { code: 'hu', name: 'Hungarian' },
  { code: 'fi', name: 'Finnish' },
  { code: 'da', name: 'Danish' },
  { code: 'no', name: 'Norwegian' },
  { code: 'ca', name: 'Catalan' },
  { code: 'uk', name: 'Ukrainian' },
  { code: 'fa', name: 'Persian' },
  { code: 'sw', name: 'Swahili' },
  { code: 'es', name: 'Spanish' },
];

interface MotherTongueStepProps {
  selectedMothertongue: Mothertongue | null;
  onSelect: (language: Mothertongue) => void;
}

export function MotherTongueStep({ selectedMothertongue, onSelect }: MotherTongueStepProps) {
  const isOtherSelected = selectedMothertongue
    ? OTHER_LANGUAGES.some((l) => l.code === selectedMothertongue.code)
    : false;

  const [isExpanded, setIsExpanded] = useState(isOtherSelected);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">What is your native language?</h2>
        <p className="mt-1 text-sm text-muted-foreground">Select the language you grew up speaking</p>
      </div>
      <div className="space-y-3">
        {MAIN_LANGUAGES.map((lang) => (
          <LevelOption
            key={lang.code}
            level={lang.code.toUpperCase()}
            description={lang.name}
            isSelected={selectedMothertongue?.code === lang.code}
            onSelect={() => onSelect(lang)}
          />
        ))}
        <button
          onClick={() => setIsExpanded((prev) => !prev)}
          className={cn(
            'flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left text-sm font-medium transition-colors',
            isOtherSelected
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-border bg-card text-foreground hover:border-primary/60 hover:bg-accent/20'
          )}
        >
          <span>{isOtherSelected ? selectedMothertongue?.name : 'Other'}</span>
          <svg
            className={cn('h-4 w-4 transition-transform', isExpanded && 'rotate-180')}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {isExpanded && (
          <div className="max-h-60 overflow-y-auto rounded-lg border border-border space-y-1 p-2">
            {OTHER_LANGUAGES.map((lang) => (
              <LevelOption
                key={lang.code}
                level={lang.code.toUpperCase()}
                description={lang.name}
                isSelected={selectedMothertongue?.code === lang.code}
                onSelect={() => onSelect(lang)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
