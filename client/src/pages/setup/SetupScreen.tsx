import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/setup/ProgressBar';
import { LevelStep } from './steps/LevelStep';
import { InterestsStep } from './steps/InterestsStep';
import { useSetup } from '@/hooks/useSetup';
import type { Level } from '@thesis/types';

export default function SetupScreen() {
  const navigate = useNavigate();
  const {
    step,
    totalSteps,
    selectedLevel,
    setSelectedLevel,
    selectedInterests,
    toggleInterest,
    canContinue,
    goNext,
    handleSubmitSetup
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
              <InterestsStep selectedInterests={selectedInterests || []} onToggle={toggleInterest} />
            )}
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              onClick={handleContinue}
              disabled={!canContinue}
            >
              Continue
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
