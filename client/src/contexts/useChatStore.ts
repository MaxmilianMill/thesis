import type { Chat, Message, TaskList, TutorResponse } from "@thesis/types";
import { create } from "zustand";
import { createSelectors } from "./utils/createSelectors";

export type UIMessage = Message & {
    isStreaming?: boolean;
    tutorResponse?: TutorResponse;
};

interface ChatState {
    chat: Chat | undefined;
    history: UIMessage[];
    isTutorMode: boolean;
    setChat: (chat: Chat) => void;
    resetHistory: () => void;
    updateChat: (updatedFields: Partial<Chat>) => void;
    updateHistory: (msg: Message | Message[]) => void;
    updateTaskList: (updatedTaskList: TaskList) => void;
    revealHint: (taskId: number) => void;
    revealSolution: (taskId: number) => void;
    appendAIStreamChunk: (chunk: string) => void;
    appendUserStreamChunk: (chunk: string) => void;
    addFeedback: (feedback: Message) => void,
    finalizeAITurn: () => void;
    setTutorMode: (on: boolean) => void;
    addTutorMessage: (question: string, id: string) => void;
    resolveTutorQuestion: (id: string, response: TutorResponse | 'error') => void;
};

const useChatStore = create<ChatState>((set) => ({
    chat: undefined,
    history: [],
    isTutorMode: false,
    setChat: (chat) => set({chat}),
    resetHistory: () => set({history: [], isTutorMode: false}),
    updateChat: (updatedFields) => set((state) => {
        return {chat: {...state.chat, ...updatedFields} as Chat}
    }),
    updateHistory: (msg) => {
        set((state) => ({
            history: Array.isArray(msg) 
                ? [...state.history, ...msg] 
                : [...state.history, msg]    
        }));
    },
    updateTaskList: (updatedTaskList) => set((state) => {

        const completed = updatedTaskList.every((task) => task.completed);
        return {chat: {
            ...state.chat,
            taskList: updatedTaskList,
            completed
        } as Chat}
    }),
    revealHint: (taskId) => set((state) => {
        if (!state.chat?.taskList) return {};
        const taskList = state.chat.taskList.map((task) =>
            task.id === taskId
                ? { ...task, hint: { ...task.hint, used: true } }
                : task
        );
        return { chat: { ...state.chat, taskList } as Chat };
    }),
    revealSolution: (taskId) => set((state) => {
        if (!state.chat?.taskList) return {};
        const taskList = state.chat.taskList.map((task) =>
            task.id === taskId
                ? { ...task, solution: { ...task.solution, used: true } }
                : task
        );
        return { chat: { ...state.chat, taskList } as Chat };
    }),
    appendAIStreamChunk: (chunk) => set((state) => {
        const newHistory = [...state.history];
        const lastMsg = newHistory[newHistory.length - 1];

        if (lastMsg && !lastMsg.isUser && lastMsg.isStreaming) {
            newHistory[newHistory.length - 1] = {
                ...lastMsg,
                text: lastMsg.text + chunk
            };
        }
        else {
            newHistory.push({
                id: crypto.randomUUID(),
                isUser: false,
                text: chunk,
                isStreaming: true
            } as UIMessage);
        }

        return { history: newHistory };
    }),
    appendUserStreamChunk: (chunk) => set((state) => {
        const newHistory = [...state.history];
        const lastMsg = newHistory[newHistory.length - 1];

        if (lastMsg && lastMsg.isUser && lastMsg.isStreaming) {
            newHistory[newHistory.length - 1] = {
                ...lastMsg,
                text: lastMsg.text + chunk
            };
        }
        else {
            newHistory.push({
                id: crypto.randomUUID(),
                isUser: true,
                text: chunk,
                isStreaming: true
            } as UIMessage);
        }

        return { history: newHistory };
    }),
    addFeedback: (feedback) => set((state) => {
        const newHistory = [...state.history];
        const lastUserIndex = newHistory.findLastIndex(msg => msg.isUser);
        if (lastUserIndex !== -1) {
            newHistory[lastUserIndex] = {
                ...newHistory[lastUserIndex],
                isCorrect: feedback.isCorrect,
                improvedVersion: feedback.improvedVersion ?? undefined
            };
        }
        return { history: newHistory };
    }),
    finalizeAITurn: () => set((state) => {
        const newHistory = [...state.history];
        const lastMsg = newHistory[newHistory.length - 1];

        if (lastMsg && lastMsg.isStreaming) {
            newHistory[newHistory.length - 1] = {
                ...lastMsg,
                isStreaming: false
            };
        }
        return { history: newHistory, isTutorMode: false };
    }),
    setTutorMode: (on) => set({ isTutorMode: on }),
    addTutorMessage: (question, id) => set((state) => ({
        history: [
            ...state.history,
            {
                id,
                isUser: true,
                isTutor: true,
                text: question,
                uid: '',
                createdAt: new Date(),
            } as UIMessage,
        ],
    })),
    resolveTutorQuestion: (id, response) => set((state) => ({
        history: state.history.map((msg) => {
            if (msg.id !== id) return msg;
            if (response === 'error') {
                return {
                    ...msg,
                    tutorResponse: {
                        response_text: 'Sorry, something went wrong. Please try again.',
                        response_type: 'text',
                        suggested_next_steps: [],
                        category: 'META_INSTRUCTION',
                        explanation: '',
                        uid: '',
                        id: '',
                        chatId: '',
                        createdAt: new Date(),
                        lastMessageId: '',
                    } as TutorResponse,
                };
            }
            return { ...msg, tutorResponse: response };
        }),
    })),
}));

export const useChatSelectors = createSelectors(useChatStore);