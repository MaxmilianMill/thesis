import { useEffect, useRef } from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FEATURE_OPTIONS, FEATURE_LABELS } from '@/lib/api/partnerApi';
import type { FeatureType } from '@/lib/api/partnerApi';
import { FeatureOptionCell } from './FeatureOptionCell';
import dummyAvatar from '@/assets/dummy_avatar.png';

interface FeatureRowProps {
  feature: FeatureType;
  selectedId: string | null;
  isExpanded: boolean;
  onExpand: () => void;
  onCollapse: () => void;
  onSelect: (feature: FeatureType, optionId: string) => void;
}

export function FeatureRow({
  feature,
  selectedId,
  isExpanded,
  onExpand,
  onCollapse,
  onSelect,
}: FeatureRowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const options = FEATURE_OPTIONS[feature];
  const selectedOption = selectedId ? options.find((o) => o.id === selectedId) : null;

  useEffect(() => {
    if (!isExpanded) return;

    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onCollapse();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isExpanded, onCollapse]);

  return (
    <div ref={containerRef} className={cn('relative', isExpanded && 'z-10')}>
      {isExpanded ? (
        <div className="flex gap-1.5 animate-expand-right">
          {options.map((option) => (
            <FeatureOptionCell
              key={option.id}
              option={option}
              isSelected={selectedId === option.id}
              onSelect={() => onSelect(feature, option.id)}
            />
          ))}
        </div>
      ) : (
        <button
          onClick={onExpand}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border-2 transition-all',
            selectedId
              ? 'border-primary bg-accent/20'
              : 'border-border hover:border-primary/60 hover:bg-accent/10'
          )}
        >
          <img
            src={dummyAvatar}
            alt={FEATURE_LABELS[feature]}
            className="w-8 h-8 rounded-full object-cover shrink-0"
          />
          <span className="flex-1 text-left text-sm font-medium text-foreground">
            {FEATURE_LABELS[feature]}
          </span>
          {selectedOption ? (
            <span className="text-xs text-primary shrink-0">{selectedOption.label}</span>
          ) : (
            <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
          )}
        </button>
      )}
    </div>
  );
}
