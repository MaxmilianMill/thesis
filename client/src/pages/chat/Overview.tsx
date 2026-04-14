import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ScenarioCard } from '@/components/overview/ScenarioCard';
import { PartnerInfoCard } from '@/components/overview/PartnerInfoCard';
import { TimeLimitCard } from '@/components/overview/TimeLimitCard';
import { TaskListSection } from '@/components/overview/TaskListSection';
import { useOverview } from '@/hooks/useOverview';

export default function OverviewScreen() {
  const {
    overviewState,
    scenario,
    partner,
    tasks,
    handleGenerateTasks,
    handleStartSpeaking,
  } = useOverview();

  const isLoadingTasks = overviewState === 'loading';
  const showTasks = overviewState === 'loading' || overviewState === 'tasks';

  if (!scenario || !partner) {
    return (
      <div className="dark min-h-screen bg-background flex items-center justify-center">
        <span className="text-muted-foreground text-sm">Loading...</span>
      </div>
    );
  }

  return (
    <div className="dark min-h-screen bg-background text-foreground flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-lg">
        <Card className="overflow-hidden p-0 gap-0">
          <ScenarioCard scenario={scenario} />

          <CardContent className="px-4 pt-4 pb-2">
            {showTasks ? (
              <TaskListSection tasks={tasks} isLoading={isLoadingTasks} />
            ) : (
              <div className="flex gap-3">
                <PartnerInfoCard partner={partner} />
                <TimeLimitCard />
              </div>
            )}
          </CardContent>

          <CardFooter className="px-4 py-4 border-t-0 bg-transparent">
            {showTasks ? (
              <Button
                className="w-full h-11 text-base font-semibold"
                onClick={handleStartSpeaking}
                disabled={isLoadingTasks}
              >
                Start speaking
              </Button>
            ) : (
              <Button
                className="w-full h-11 text-base font-semibold"
                onClick={handleGenerateTasks}
              >
                Generate tasks
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
