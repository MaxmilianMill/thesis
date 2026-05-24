import { Check, X } from 'lucide-react';
import type { TaskList } from '@thesis/types';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from '@/components/ui/drawer';

type Props = {
  tasks: TaskList;
  open: boolean;
  onClose: () => void;
};

export function TaskListDrawer({ tasks, open, onClose }: Props) {
  return (
    <Drawer open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DrawerContent className="max-h-[85vh]">
        <DrawerClose className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full bg-card text-muted-foreground hover:text-foreground transition-colors">
          <X className="size-5" />
        </DrawerClose>

        <DrawerHeader className="px-6 pt-6 pb-2 text-left">
          <DrawerTitle className="text-2xl font-bold text-foreground">Your Tasks</DrawerTitle>
          <DrawerDescription className="text-sm text-muted-foreground">
            Complete the following tasks with your partner to complete the session
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex flex-col gap-3 overflow-y-auto px-6 pb-8 pt-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center gap-3 rounded-lg bg-card border border-border px-4 py-3"
            >
              <div
                className={`flex size-6 flex-shrink-0 items-center justify-center rounded-md border-2 transition-colors ${
                  task.completed
                    ? 'border-success bg-success'
                    : 'border-primary bg-transparent'
                }`}
              >
                {task.completed && <Check className="size-3.5 text-foreground" strokeWidth={3} />}
              </div>
              <span className="text-sm text-foreground">
                {task.id}. {task.description}
              </span>
            </div>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
