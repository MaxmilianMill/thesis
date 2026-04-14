import { ChatInput } from '@/components/chat/Input';
import { MessageList } from '@/components/chat/MessageList';
import { PartnerSection } from '@/components/chat/PartnerSection';
import { TaskList } from '@/components/chat/TaskList';
import type { Message, TaskList as TaskListType } from '@thesis/types';

const mockMessages: Message[] = [
  {
    id: '1',
    uid: 'partner',
    text: 'Hello Sir, what can I get for you today?',
    isUser: false,
    createdAt: new Date(),
  },
  {
    id: '2',
    uid: 'user',
    text: 'Hello Madame, I would like to have a large coffee with extra milk please!',
    isUser: true,
    isCorrect: true,
    createdAt: new Date(),
  },
];

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
  return (
    <div className="dark flex min-h-screen flex-col bg-background text-foreground max-w-xl mx-auto">
      <PartnerSection scenarioTitle="Ordering Coffee" />
      <TaskList tasks={mockTasks} />
      <div className="flex flex-1 items-end">
        <MessageList messages={mockMessages} partnerName="Amy" />
      </div>
      <ChatInput />
    </div>
  );
}
