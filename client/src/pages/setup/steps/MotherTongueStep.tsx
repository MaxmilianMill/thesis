import { useState } from 'react';
import { cn } from '@/lib/utils';
import { LevelOption } from '@/components/setup/LevelOption';
import { Input } from '@/components/ui/input';
import type { Mothertongue } from '@thesis/types';

const MAIN_LANGUAGES: Mothertongue[] = [
  { code: 'de', name: 'German' },
  { code: 'en', name: 'English' },
];

interface MotherTongueStepProps {
  selectedMothertongue: Mothertongue | null;
  onSelect: (language: Mothertongue) => void;
}

export function MotherTongueStep({ selectedMothertongue, onSelect }: MotherTongueStepProps) {
  const isOtherSelected = selectedMothertongue?.code === 'other';

  const [isOtherExpanded, setIsOtherExpanded] = useState(isOtherSelected);
  const [otherInput, setOtherInput] = useState(isOtherSelected ? (selectedMothertongue?.name ?? '') : '');

  function handleAddOther() {
    const trimmed = otherInput.trim();
    if (!trimmed) return;
    onSelect({ code: 'other', name: trimmed });
  }

  function handleOtherKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleAddOther();
  }

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
          onClick={() => setIsOtherExpanded((prev) => !prev)}
          className={cn(
            'flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left text-sm font-medium transition-colors',
            isOtherSelected
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-border bg-card text-foreground hover:border-primary/60 hover:bg-accent/20'
          )}
        >
          <span>{isOtherSelected ? selectedMothertongue?.name : 'Other'}</span>
        </button>
        {isOtherExpanded && (
          <div className="flex gap-2">
            <Input
              placeholder="Type your language and press Enter..."
              value={otherInput}
              onChange={(e) => setOtherInput(e.target.value)}
              onKeyDown={handleOtherKeyDown}
              className="bg-card border-border text-foreground placeholder:text-muted-foreground"
            />
            <button
              onClick={handleAddOther}
              className="rounded-lg border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
            >
              Add
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
