import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/setup/ProgressBar';
import { LevelStep } from './steps/LevelStep';
import { InterestsStep } from './steps/InterestsStep';
import { useSetup } from '@/hooks/useSetup';
import { submitSetup } from '@/lib/api/setupApi';

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
  } = useSetup();

  async function handleContinue() {
    if (step < totalSteps - 1) {
      goNext();
    } else {
      await submitSetup({ level: selectedLevel!, interests: selectedInterests });
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
              <LevelStep selectedLevel={selectedLevel} onSelect={setSelectedLevel} />
            )}
            {step === 1 && (
              <InterestsStep selectedInterests={selectedInterests} onToggle={toggleInterest} />
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
