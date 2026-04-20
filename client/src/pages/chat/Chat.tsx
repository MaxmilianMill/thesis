import { useNavigate } from 'react-router-dom';
import { ChatInput } from '@/components/chat/Input';
import { MessageList } from '@/components/chat/MessageList';
import { PartnerSection } from '@/components/chat/PartnerSection';
import { TaskList } from '@/components/chat/TaskList';
import { useChatSelectors } from '@/contexts/useChatStore';
import { useMessageController } from '@/hooks/useMessageController';
import { useChatLifecycle } from '@/hooks/useChatLifecycle';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { TaskList as TaskListType } from '@thesis/types';

const mockTasks: TaskListType = [
  {
    id: 1,
    description: 'Greet the Barista',
    completed: true,
    hint: { text: 'Start with a friendly "Hello!"', used: false },
    solution: { text: 'Hello! How are you today?', used: false },
  },
  {
    id: 2,
    description: 'Ask for their specials',
    completed: false,
    hint: { text: 'Ask what they recommend today.', used: false },
    solution: { text: 'Do you have any specials today?', used: false },
  },
  {
    id: 3,
    description: 'Order a large cappuccino',
    completed: false,
    hint: { text: 'Specify the size when ordering.', used: false },
    solution: { text: 'I would like a large cappuccino, please.', used: false },
  },
  {
    id: 4,
    description: 'Ask for the receipt',
    completed: false,
    hint: { text: 'Politely request a receipt after paying.', used: false },
    solution: { text: 'Could I have the receipt, please?', used: false },
  },
  {
    id: 5,
    description: 'Say goodbye',
    completed: false,
    hint: { text: 'End the conversation politely.', used: false },
    solution: { text: 'Thank you, have a great day!', used: false },
  },
];

export default function ChatScreen() {
  const navigate = useNavigate();

  const {
    sendTextMessage,
    toggleRecording,
    isRecording,
    history
  } = useMessageController();

  const chat = useChatSelectors.use.chat();
  const { isChatFinished, allTasksCompleted } = useChatLifecycle();

  const goToSummary = () => navigate('/summary');

  if (!chat)
    return <p>Loading chat...</p>

  return (
    <div className="dark flex min-h-screen flex-col bg-background text-foreground max-w-xl mx-auto">
      <PartnerSection
        scenarioTitle={chat.scenario?.title ?? 'Chat'}
        onGiveUp={goToSummary}
      />
      <TaskList tasks={chat.taskList ?? mockTasks} />
      <div className="flex flex-1 items-end">
        <MessageList messages={history} partnerName="Amy" />
      </div>
      <ChatInput
        sendTextMessage={sendTextMessage}
        toggleRecording={toggleRecording}
        isRecording={isRecording}
        disabled={!!isChatFinished}
      />

      <Dialog open={!!isChatFinished}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>
              {allTasksCompleted ? 'All tasks completed!' : "Time's up"}
            </DialogTitle>
            <DialogDescription>
              {allTasksCompleted
                ? 'Great work! You completed all the tasks in this scenario. Click below to see your summary.'
                : "You've reached the message limit for this session. Click below to see how you did."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button className="w-full" onClick={goToSummary}>
              Get Summary
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
