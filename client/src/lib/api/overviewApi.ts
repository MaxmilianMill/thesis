import type { Scenario, Partner, TaskList } from '@thesis/types';

export type OverviewData = {
  scenario: Scenario;
  partner: Partner;
};

const MOCK_SCENARIO: Scenario = {
  title: 'Ordering in a Café',
  aiDescription: 'You are a friendly barista at a cozy café.',
  userDescription: 'You are a customer who wants to order coffee and a snack.',
  imgPath: '/mockups/cafe.jpg',
};

const MOCK_PARTNER: Partner = {
  voiceConfig: { voiceName: 'Samira', languageCode: 'en-US' },
  personalityDescription: 'Helpful',
  color: 'skin-medium',
  hair: 'hair-straight',
  eyes: 'eyes-round',
  nose: 'nose-button',
  mouth: 'mouth-smile',
};

const MOCK_TASKS: TaskList = [
  {
    id: 1,
    description: 'Greet the Barista',
    completed: false,
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

export async function fetchOverviewData(): Promise<OverviewData> {
  return new Promise((resolve) =>
    setTimeout(() => resolve({ scenario: MOCK_SCENARIO, partner: MOCK_PARTNER }), 300)
  );
}

export async function generateTasks(_scenario: Scenario): Promise<TaskList> {
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_TASKS), 1500));
}
