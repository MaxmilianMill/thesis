import { useState } from 'react';
import { Info, Lightbulb, CheckCircle2 } from 'lucide-react';
import type { TaskList as TaskListType } from '@thesis/types';
import { TaskListDrawer } from './TaskListDrawer';
import { useChatSelectors } from '@/contexts/useChatStore';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

type Props = {
  tasks: TaskListType;
  onHintUsed?: (taskId: number) => void;
  onSolutionUsed?: (taskId: number) => void;
};

type DialogMode =
  | { type: 'none' }
  | { type: 'confirm-hint' }
  | { type: 'confirm-solution' }
  | { type: 'show-hint' }
  | { type: 'show-solution' };

export function TaskList({ tasks, onHintUsed, onSolutionUsed }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dialog, setDialog] = useState<DialogMode>({ type: 'none' });

  const revealHint = useChatSelectors.use.revealHint();
  const revealSolution = useChatSelectors.use.revealSolution();

  const currentTask = tasks.find((task) => !task.completed);

  if (!currentTask) return null;

  const handleInfoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentTask.hint.used) {
      setDialog({ type: 'confirm-hint' });
    } else if (!currentTask.solution.used) {
      setDialog({ type: 'confirm-solution' });
    } else {
      setDialog({ type: 'show-solution' });
    }
  };

  const closeDialog = () => setDialog({ type: 'none' });

  const confirmHint = () => {
    revealHint(currentTask.id);
    onHintUsed?.(currentTask.id);
    setDialog({ type: 'show-hint' });
  };

  const confirmSolution = () => {
    revealSolution(currentTask.id);
    onSolutionUsed?.(currentTask.id);
    setDialog({ type: 'show-solution' });
  };

  return (
    <>
      <div className="px-5 pb-2">
        <p className="mb-1.5 text-xs font-medium text-muted-foreground">Current Task</p>
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex w-full items-center gap-3 rounded-lg bg-card border border-border px-4 py-3 text-left transition-colors hover:bg-accent/20 active:bg-accent/30"
        >
          <div className="flex size-6 flex-shrink-0 items-center justify-center rounded-md border-2 border-primary bg-transparent" />
          <span className="flex-1 text-sm text-foreground">
            {currentTask.id}. {currentTask.description}
          </span>
          <span
            role="button"
            tabIndex={0}
            onClick={handleInfoClick}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleInfoClick(e as unknown as React.MouseEvent);
              }
            }}
            className="flex size-6 flex-shrink-0 items-center justify-center rounded-md text-muted-foreground hover:text-foreground transition-colors"
          >
            <Info className="size-4" />
          </span>
        </button>
      </div>

      <TaskListDrawer
        tasks={tasks}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />

      <Dialog
        open={dialog.type === 'confirm-hint'}
        onOpenChange={(open) => !open && closeDialog()}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Show hint?</DialogTitle>
            <DialogDescription>
              Need a little nudge? We can show you a hint for this task.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-row justify-end gap-2 sm:gap-2">
            <Button variant="ghost" onClick={closeDialog}>
              Cancel
            </Button>
            <Button onClick={confirmHint}>Show hint</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={dialog.type === 'confirm-solution'}
        onOpenChange={(open) => !open && closeDialog()}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Show solution?</DialogTitle>
            <DialogDescription>
              Still stuck? We can reveal an example solution for this task.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-row justify-end gap-2 sm:gap-2">
            <Button variant="ghost" onClick={closeDialog}>
              Cancel
            </Button>
            <Button onClick={confirmSolution}>Show solution</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={dialog.type === 'show-hint'}
        onOpenChange={(open) => !open && closeDialog()}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lightbulb className="size-5 text-primary" />
              Hint
            </DialogTitle>
            <DialogDescription>{currentTask.hint.text}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={closeDialog}>Got it</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={dialog.type === 'show-solution'}
        onOpenChange={(open) => !open && closeDialog()}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="size-5 text-success" />
              Solution
            </DialogTitle>
            <DialogDescription>{currentTask.solution.text}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={closeDialog}>Got it</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
