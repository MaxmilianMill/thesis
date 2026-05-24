import type { Task } from '@thesis/types';

interface TaskItemProps {
  task: Task;
}

export function TaskItem({ task }: TaskItemProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-card border border-border px-4 py-3">
      <div className="w-4 h-4 flex-shrink-0 rounded-sm border border-muted-foreground/50" />
      <span className="text-sm text-foreground">
        {task.id}. {task.description}
      </span>
    </div>
  );
}
