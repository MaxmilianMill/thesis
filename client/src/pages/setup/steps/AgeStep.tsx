const AGE_RANGES = ["18-20", "21-25", "26-30", "31-35", "36-40"];

interface AgeStepProps {
  selectedAgeRange: string;
  onSelect: (range: string) => void;
}

export function AgeStep({ selectedAgeRange, onSelect }: AgeStepProps) {
  const currentIndex = AGE_RANGES.indexOf(selectedAgeRange);
  const safeIndex = currentIndex === -1 ? 2 : currentIndex;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    onSelect(AGE_RANGES[Number(e.target.value)]);
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground">How old are you?</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Select your age range
        </p>
      </div>
      <div className="space-y-6">
        <div className="text-center">
          <span className="text-5xl font-bold text-primary">{AGE_RANGES[safeIndex]}</span>
        </div>
        <div className="px-2">
          <input
            type="range"
            min={0}
            max={AGE_RANGES.length - 1}
            step={1}
            value={safeIndex}
            onChange={handleChange}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-primary bg-accent"
          />
          <div className="flex justify-between mt-2">
            {AGE_RANGES.map((range, i) => (
              <span
                key={range}
                className={`text-xs transition-colors ${i === safeIndex ? 'text-primary font-semibold' : 'text-muted-foreground'}`}
              >
                {range}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
