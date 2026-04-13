import { useState } from 'react';

const TOTAL_STEPS = 2;
const MAX_INTERESTS = 5;

export function useSetup() {
  const [step, setStep] = useState(0);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const canContinue = step === 0 ? selectedLevel !== null : selectedInterests.length > 0;

  function goNext() {
    if (step < TOTAL_STEPS - 1) {
      setStep((s) => s + 1);
    }
  }

  function toggleInterest(interest: string) {
    setSelectedInterests((prev) => {
      if (prev.includes(interest)) {
        return prev.filter((i) => i !== interest);
      }
      if (prev.length >= MAX_INTERESTS) return prev;
      return [...prev, interest];
    });
  }

  return {
    step,
    totalSteps: TOTAL_STEPS,
    selectedLevel,
    setSelectedLevel,
    selectedInterests,
    toggleInterest,
    canContinue,
    goNext,
  };
}
