const MAX_CHARS = 200;

interface LearningGoalStepProps {
  value: string;
  onChange: (value: string) => void;
}

export function LearningGoalStep({ value, onChange }: LearningGoalStepProps) {
  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    if (e.target.value.length <= MAX_CHARS) {
      onChange(e.target.value);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">What is your learning goal?</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Describe what you want to achieve with this language
        </p>
      </div>
      <div className="space-y-2">
        <textarea
          placeholder="e.g. I want to be able to have fluent conversations while traveling..."
          value={value}
          onChange={handleChange}
          rows={5}
          className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/60 resize-none transition-colors"
        />
        <p className="text-right text-xs text-muted-foreground">
          {value.length} / {MAX_CHARS}
        </p>
      </div>
    </div>
  );
}
