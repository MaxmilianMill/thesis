import { useSetupSelectors } from '@/contexts/useSetupStore';
import { submitSetup, updateSetup } from '@/lib/api/setupApi';
import type { Gender, Level, Mothertongue, UserInfo } from '@thesis/types';
import { useCallback, useState } from 'react';

const TOTAL_STEPS = 10;
const MAX_INTERESTS = 5;
const MAX_DIFFICULTIES = 5;
const DEFAULT_AGE_RANGE = '26-30';

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
    if (step === 4) return true;
    if (step === 5) return !!draftUserInfo.gender;
    if (step === 6) return true;
    if (step === 7) return (draftUserInfo.spokenLanguages?.length ?? 0) > 0;
    if (step === 8) return true;
    if (step === 9) return (draftUserInfo.learningTools?.length ?? 0) > 0;
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

  const toggleSpokenLanguage = useCallback((language: string) => {
    const current = draftUserInfo.spokenLanguages || [];

    if (current.includes(language)) {
      updateDraft({ spokenLanguages: current.filter((l) => l !== language) });
    } else {
      updateDraft({ spokenLanguages: [...current, language] });
    }
  }, [draftUserInfo.spokenLanguages, updateDraft]);

  const toggleLearningTool = useCallback((tool: string) => {
    const current = draftUserInfo.learningTools || [];

    if (current.includes(tool)) {
      updateDraft({ learningTools: current.filter((t) => t !== tool) });
    } else {
      updateDraft({ learningTools: [...current, tool] });
    }
  }, [draftUserInfo.learningTools, updateDraft]);

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
    selectedAgeRange: draftUserInfo.ageRange ?? DEFAULT_AGE_RANGE,
    setSelectedAgeRange: (ageRange: string) => updateDraft({ ageRange }),
    selectedGender: draftUserInfo.gender as Gender | undefined,
    setSelectedGender: (gender: Gender) => updateDraft({ gender }),
    fieldOfWork: draftUserInfo.fieldOfWork ?? '',
    setFieldOfWork: (fieldOfWork: string) => updateDraft({ fieldOfWork }),
    selectedSpokenLanguages: draftUserInfo.spokenLanguages ?? [],
    toggleSpokenLanguage,
    learningGoal: draftUserInfo.learningGoal ?? '',
    setLearningGoal: (learningGoal: string) => updateDraft({ learningGoal }),
    selectedLearningTools: draftUserInfo.learningTools ?? [],
    toggleLearningTool,
    canContinue,
    goNext,
    handleSubmitSetup,
    handleUpdateSetup,
  };
}
