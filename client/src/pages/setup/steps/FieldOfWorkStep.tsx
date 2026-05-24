import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FieldOfWorkStepProps {
  value: string;
  onChange: (value: string) => void;
}

export function FieldOfWorkStep({ value, onChange }: FieldOfWorkStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">What do you do?</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Tell us about your field of work or study
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="field-of-work" className="text-foreground">
          Field of work / study
        </Label>
        <Input
          id="field-of-work"
          placeholder="e.g. Software Engineering, Medicine, Marketing..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-card border-border text-foreground placeholder:text-muted-foreground"
        />
      </div>
    </div>
  );
}
