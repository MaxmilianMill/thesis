import { useSetupSelectors } from '@/contexts/useSetupStore';
import { submitSetup, updateSetup } from '@/lib/api/setupApi';
import type { Level, Mothertongue, UserInfo } from '@thesis/types';
import { useCallback, useState } from 'react';

const TOTAL_STEPS = 4;
const MAX_INTERESTS = 5;
const MAX_DIFFICULTIES = 5;

export function useSetup() {
  const [step, setStep] = useState(0);
  const setUserInfo = useSetupSelectors.use.setUserInfo();
  const updateUserInfo = useSetupSelectors.use.updateUserInfo();
  const draftUserInfo = useSetupSelectors.use.draftUserInfo();
  const updateDraft = useSetupSelectors.use.updateDraft();
  const resetDraft = useSetupSelectors.use.resetDraft();

  const canContinue = (() => {
    if (step === 0) return !!draftUserInfo.level;
    if (step === 1) return !!draftUserInfo.mothertongue;
    if (step === 2) return (draftUserInfo.difficulties?.length ?? 0) > 0;
    if (step === 3) return (draftUserInfo.interests?.length ?? 0) > 0;
    return false;
  })();

  function goNext() {
    if (step < TOTAL_STEPS - 1) {
      setStep((s) => s + 1);
    }
  }

  const toggleInterest = useCallback((interest: string) => {
    const currentInterests = draftUserInfo.interests || [];

    if (currentInterests.includes(interest)) {
      updateDraft({ interests: currentInterests.filter((i) => i !== interest) });
      return;
    }

    if (currentInterests.length >= MAX_INTERESTS) return;

    updateDraft({ interests: [...currentInterests, interest] });
  }, [draftUserInfo.interests, updateDraft]);

  const toggleDifficulty = useCallback((difficulty: string) => {
    const current = draftUserInfo.difficulties || [];

    if (current.includes(difficulty)) {
      updateDraft({ difficulties: current.filter((d) => d !== difficulty) });
      return;
    }

    if (current.length >= MAX_DIFFICULTIES) return;

    updateDraft({ difficulties: [...current, difficulty] });
  }, [draftUserInfo.difficulties, updateDraft]);

  const handleSubmitSetup = useCallback(async () => {
    const _userInfo = await submitSetup({ ...draftUserInfo });

    if (!_userInfo) return;

    setUserInfo(_userInfo);
    resetDraft();
  }, [draftUserInfo]);

  async function handleUpdateSetup(data: Partial<UserInfo>, docId: string) {
    const updatedFields = await updateSetup(data, docId);

    if (!updatedFields) return;

    updateUserInfo(updatedFields);
  }

  return {
    step,
    totalSteps: TOTAL_STEPS,
    selectedLevel: draftUserInfo.level,
    setSelectedLevel: (level: Level) => updateDraft({ level }),
    selectedMothertongue: draftUserInfo.mothertongue,
    setSelectedMothertongue: (mothertongue: Mothertongue) => updateDraft({ mothertongue }),
    selectedDifficulties: draftUserInfo.difficulties ?? [],
    toggleDifficulty,
    selectedInterests: draftUserInfo.interests ?? [],
    toggleInterest,
    canContinue,
    goNext,
    handleSubmitSetup,
    handleUpdateSetup,
  };
}
