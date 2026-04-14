import { useState } from 'react';
import { Info } from 'lucide-react';
import type { TaskList as TaskListType } from '@thesis/types';
import { TaskListDrawer } from './TaskListDrawer';

type Props = {
  tasks: TaskListType;
};

export function TaskList({ tasks }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const currentTask = tasks.find((task) => !task.completed);

  if (!currentTask) return null;

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
          <Info className="size-4 flex-shrink-0 text-muted-foreground" />
        </button>
      </div>

      <TaskListDrawer
        tasks={tasks}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </>
  );
}
