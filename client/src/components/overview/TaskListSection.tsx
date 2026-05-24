import type { TaskList } from '@thesis/types';
import { TaskItem } from './TaskItem';
import { TaskListSkeleton } from './TaskListSkeleton';

interface TaskListSectionProps {
  tasks: TaskList | null;
  isLoading: boolean;
}

export function TaskListSection({ tasks, isLoading }: TaskListSectionProps) {
  return (
    <div className="flex flex-col gap-3">
      <div>
        <h3 className="text-lg font-bold text-foreground">Your Tasks</h3>
        <p className="text-sm text-muted-foreground">
          Complete the following tasks with your partner to complete the session
        </p>
      </div>

      {isLoading ? (
        <TaskListSkeleton />
      ) : (
        <div className="flex flex-col gap-2 overflow-y-auto max-h-[45vh]">
          {tasks?.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
}
