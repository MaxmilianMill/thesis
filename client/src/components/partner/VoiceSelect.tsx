import { PlayCircle } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { VOICE_OPTIONS } from '@/lib/api/partnerApi';

interface VoiceSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function VoiceSelect({ value, onChange }: VoiceSelectProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm text-muted-foreground">Voice</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full h-14 bg-input border-border px-4 gap-3">
          <PlayCircle className="w-6 h-6 text-primary shrink-0" />
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {VOICE_OPTIONS.map((voice) => (
            <SelectItem key={voice.id} value={voice.id}>
              {voice.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
