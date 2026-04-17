import type { TaskList, Partner, Chat } from '@thesis/types';
import { api } from './config';
import { HttpStatusCode } from 'axios';

const MOCK_TASKS: TaskList = [
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

const MOCK_PARTNER: Partner = {
  voiceConfig: { voiceName: 'Amy', languageCode: 'en-US' },
  personalityDescription: 'Friendly barista',
  color: 'skin-medium',
  hair: 'hair-straight',
  eyes: 'eyes-round',
  nose: 'nose-button',
  mouth: 'mouth-smile',
};

export async function fetchTaskList(): Promise<TaskList> {
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_TASKS), 200));
}

export async function fetchPartner(): Promise<Partner> {
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_PARTNER), 200));
}

export async function createChat(chat: Partial<Chat>): Promise<Chat> {
  return await api.post("/chat/create", {chat}).then((res) => {
    if (res.status !== HttpStatusCode.Created) return;

    return res.data.chat;
  }).catch((error) => {
    console.error(error.message);
    return;
  })
}
