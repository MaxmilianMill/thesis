import { useState } from 'react';
import { cn } from '@/lib/utils';
import { InterestChip } from '@/components/setup/InterestChip';
import { Input } from '@/components/ui/input';

const TOP_LANGUAGES = [
  'Mandarin Chinese',
  'Spanish',
  'English',
  'Hindi',
  'Arabic',
  'Bengali',
  'Portuguese',
  'Russian',
  'Japanese',
  'German',
];

interface SpokenLanguagesStepProps {
  selectedLanguages: string[];
  onToggle: (language: string) => void;
}

export function SpokenLanguagesStep({ selectedLanguages, onToggle }: SpokenLanguagesStepProps) {
  const [isOtherExpanded, setIsOtherExpanded] = useState(false);
  const [otherInput, setOtherInput] = useState('');

  const customLanguages = selectedLanguages.filter((l) => !TOP_LANGUAGES.includes(l));

  function handleAddOther() {
    const trimmed = otherInput.trim();
    if (!trimmed) return;
    if (!selectedLanguages.includes(trimmed)) {
      onToggle(trimmed);
    }
    setOtherInput('');
  }

  function handleOtherKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleAddOther();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">What languages do you speak?</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Select all languages you know ({selectedLanguages.length} selected)
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {TOP_LANGUAGES.map((lang) => (
          <InterestChip
            key={lang}
            interest={lang}
            isSelected={selectedLanguages.includes(lang)}
            isDisabled={false}
            onToggle={() => onToggle(lang)}
          />
        ))}
        {customLanguages.map((lang) => (
          <InterestChip
            key={lang}
            interest={lang}
            isSelected={true}
            isDisabled={false}
            onToggle={() => onToggle(lang)}
          />
        ))}
        <button
          onClick={() => setIsOtherExpanded((prev) => !prev)}
          className={cn(
            'rounded-full border px-4 py-2 text-sm font-medium transition-colors',
            isOtherExpanded
              ? 'border-primary bg-primary/20 text-primary'
              : 'border-border bg-card text-muted-foreground hover:border-primary/60 hover:text-foreground'
          )}
        >
          + Other
        </button>
      </div>
      {isOtherExpanded && (
        <div className="flex gap-2">
          <Input
            placeholder="Type a language and press Enter..."
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
  );
}
