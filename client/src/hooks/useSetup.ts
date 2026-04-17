import { useSetupSelectors } from '@/contexts/useSetupStore';
import { submitSetup, updateSetup } from '@/lib/api/setupApi';
import type { Level, UserInfo } from '@thesis/types';
import { useCallback, useState } from 'react';

const TOTAL_STEPS = 2;
const MAX_INTERESTS = 5;

export function useSetup() {
  const [step, setStep] = useState(0);
  const setUserInfo = useSetupSelectors.use.setUserInfo();
  const updateUserInfo = useSetupSelectors.use.updateUserInfo();
  const draftUserInfo = useSetupSelectors.use.draftUserInfo();
  const updateDraft = useSetupSelectors.use.updateDraft();
  const resetDraft = useSetupSelectors.use.resetDraft();

  const canContinue = step === 0 ? draftUserInfo.level !== null : draftUserInfo.interests && draftUserInfo.interests.length > 0;

  function goNext() {
    if (step < TOTAL_STEPS - 1) {
      setStep((s) => s + 1);
    }
  }

  const toggleInterest = useCallback((interest: string) => {
    const currentInterests = draftUserInfo.interests || [];

    if (currentInterests.includes(interest)) {
      updateDraft({ 
        interests: currentInterests.filter((i) => i !== interest) 
      });
      return; 
    }

    if (currentInterests.length >= MAX_INTERESTS) return;

    updateDraft({ 
      interests: [...currentInterests, interest] 
    });
  }, [draftUserInfo.interests, updateDraft]);

  const handleSubmitSetup = useCallback(async () => {
    const _userInfo = await submitSetup({...draftUserInfo});

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
    setSelectedLevel: (level: Level) => updateDraft({level}),
    selectedInterests: draftUserInfo.interests,
    toggleInterest,
    canContinue,
    goNext,
    handleSubmitSetup,
    handleUpdateSetup
  };
}
