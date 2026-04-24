import { useState } from 'react';
import { cn } from '@/lib/utils';
import { InterestChip } from '@/components/setup/InterestChip';
import { Input } from '@/components/ui/input';

const TOOL_OPTIONS = [
  'Duolingo',
  'Other language apps',
  'Classes',
  'Videos',
  'Music',
  'Texts',
];

interface LearningToolsStepProps {
  selectedTools: string[];
  onToggle: (tool: string) => void;
}

export function LearningToolsStep({ selectedTools, onToggle }: LearningToolsStepProps) {
  const [isOtherExpanded, setIsOtherExpanded] = useState(false);
  const [otherInput, setOtherInput] = useState('');

  const customTools = selectedTools.filter((t) => !TOOL_OPTIONS.includes(t));

  function handleAddOther() {
    const trimmed = otherInput.trim();
    if (!trimmed) return;
    if (!selectedTools.includes(trimmed)) {
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
        <h2 className="text-2xl font-bold text-foreground">How have you been learning?</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Select the tools and methods you use or have used ({selectedTools.length} selected)
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {TOOL_OPTIONS.map((tool) => (
          <InterestChip
            key={tool}
            interest={tool}
            isSelected={selectedTools.includes(tool)}
            isDisabled={false}
            onToggle={() => onToggle(tool)}
          />
        ))}
        {customTools.map((tool) => (
          <InterestChip
            key={tool}
            interest={tool}
            isSelected={true}
            isDisabled={false}
            onToggle={() => onToggle(tool)}
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
            placeholder="Type a tool or method and press Enter..."
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
