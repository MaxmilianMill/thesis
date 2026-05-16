import { useNavigate } from 'react-router-dom';
import { ChatInput } from '@/components/chat/Input';
import { MessageList } from '@/components/chat/MessageList';
import { PartnerSection } from '@/components/chat/PartnerSection';
import { TaskList } from '@/components/chat/TaskList';
import { useChatSelectors } from '@/contexts/useChatStore';
import { useSetupSelectors } from '@/contexts/useSetupStore';
import { useMessageController } from '@/hooks/useMessageController';
import { useChatLifecycle } from '@/hooks/useChatLifecycle';
import { useChatRestore } from '@/hooks/useChatRestore';
import { useTutor } from '@/hooks/useTutor';
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

  const { isRestoring } = useChatRestore();

  const {
    sendTextMessage,
    toggleRecording,
    isRecording,
    history,
    connectionStatus,
    sendHintUsed,
    sendSolutionUsed
  } = useMessageController();

  const chat = useChatSelectors.use.chat();
  const userInfo = useSetupSelectors.use.userInfo();
  const { isChatFinished, allTasksCompleted } = useChatLifecycle();

  const { isTutorMode, toggleTutorMode, isLoading: isTutorLoading, sendQuestion } = useTutor(userInfo, chat?.id);

  const goToSummary = () => navigate('/summary');

  if (isRestoring)
    return (
      <div className="dark flex h-screen items-center justify-center bg-background text-foreground">
        <p className="text-muted-foreground">Restoring session...</p>
      </div>
    );

  return (
    <div className="dark flex h-screen flex-col bg-background text-foreground max-w-xl mx-auto overflow-hidden">
      <PartnerSection
        scenarioTitle={chat?.scenario?.title ?? 'Chat'}
        onGiveUp={goToSummary}
        isWarmup={chat?.condition === "warmup"}
      />
      <TaskList
        tasks={chat?.taskList ?? mockTasks}
        onHintUsed={sendHintUsed}
        onSolutionUsed={sendSolutionUsed}
      />
      <div className="flex-1 overflow-hidden flex flex-col">
        <MessageList messages={history} partnerName={userInfo?.partner?.name || "Partner"} isTutorMode={isTutorMode} />
      </div>
      <ChatInput
        sendTextMessage={sendTextMessage}
        toggleRecording={toggleRecording}
        isRecording={isRecording}
        onHelpPress={toggleTutorMode}
        isTutorMode={isTutorMode}
        onTutorSend={sendQuestion}
        isTutorLoading={isTutorLoading}
        disabled={!!isChatFinished}
        isConnected={connectionStatus}
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
