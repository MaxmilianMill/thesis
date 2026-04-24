import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/setup/ProgressBar';
import { LevelStep } from './steps/LevelStep';
import { MotherTongueStep } from './steps/MotherTongueStep';
import { DifficultiesStep } from './steps/DifficultiesStep';
import { InterestsStep } from './steps/InterestsStep';
import { AgeStep } from './steps/AgeStep';
import { GenderStep } from './steps/GenderStep';
import { FieldOfWorkStep } from './steps/FieldOfWorkStep';
import { SpokenLanguagesStep } from './steps/SpokenLanguagesStep';
import { LearningGoalStep } from './steps/LearningGoalStep';
import { LearningToolsStep } from './steps/LearningToolsStep';
import { useSetup } from '@/hooks/useSetup';
import type { Gender, Level } from '@thesis/types';

export default function SetupScreen() {
  const navigate = useNavigate();
  const {
    step,
    totalSteps,
    selectedLevel,
    setSelectedLevel,
    selectedMothertongue,
    setSelectedMothertongue,
    selectedDifficulties,
    toggleDifficulty,
    selectedInterests,
    toggleInterest,
    selectedAgeRange,
    setSelectedAgeRange,
    selectedGender,
    setSelectedGender,
    fieldOfWork,
    setFieldOfWork,
    selectedSpokenLanguages,
    toggleSpokenLanguage,
    learningGoal,
    setLearningGoal,
    selectedLearningTools,
    toggleLearningTool,
    canContinue,
    goNext,
    handleSubmitSetup,
  } = useSetup();

  async function handleContinue() {
    if (step < totalSteps - 1) {
      goNext();
    } else {
      await handleSubmitSetup();
      navigate('/partner');
    }
  }

  return (
    <div className="dark min-h-screen bg-background text-foreground p-6 md:p-10 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        <ProgressBar currentStep={step} totalSteps={totalSteps} />
        <Card>
          <CardContent className="pt-6">
            {step === 0 && (
              <LevelStep selectedLevel={selectedLevel as Level} onSelect={setSelectedLevel} />
            )}
            {step === 1 && (
              <MotherTongueStep
                selectedMothertongue={selectedMothertongue ?? null}
                onSelect={setSelectedMothertongue}
              />
            )}
            {step === 2 && (
              <DifficultiesStep
                selectedDifficulties={selectedDifficulties}
                onToggle={toggleDifficulty}
              />
            )}
            {step === 3 && (
              <InterestsStep selectedInterests={selectedInterests} onToggle={toggleInterest} />
            )}
            {step === 4 && (
              <AgeStep selectedAgeRange={selectedAgeRange} onSelect={setSelectedAgeRange} />
            )}
            {step === 5 && (
              <GenderStep selectedGender={selectedGender as Gender | undefined} onSelect={setSelectedGender} />
            )}
            {step === 6 && (
              <FieldOfWorkStep value={fieldOfWork} onChange={setFieldOfWork} />
            )}
            {step === 7 && (
              <SpokenLanguagesStep
                selectedLanguages={selectedSpokenLanguages}
                onToggle={toggleSpokenLanguage}
              />
            )}
            {step === 8 && (
              <LearningGoalStep value={learningGoal} onChange={setLearningGoal} />
            )}
            {step === 9 && (
              <LearningToolsStep
                selectedTools={selectedLearningTools}
                onToggle={toggleLearningTool}
              />
            )}
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={handleContinue} disabled={!canContinue}>
              Continue
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
