import type { Chat, Message, TaskList } from "@thesis/types";
import { create } from "zustand";
import { createSelectors } from "./utils/createSelectors";

type UIMessage = Message & { isStreaming?: boolean };

interface ChatState {
    chat: Chat | undefined;
    history: UIMessage[];
    setChat: (chat: Chat) => void;
    updateChat: (updatedFields: Partial<Chat>) => void;
    updateHistory: (msg: Message | Message[]) => void;
    updateTaskList: (updatedTaskList: TaskList) => void;
    appendAIStreamChunk: (chunk: string) => void;
    appendUserStreamChunk: (chunk: string) => void;
    addFeedback: (feedback: Message) => void,
    finalizeAITurn: () => void;
};

const useChatStore = create<ChatState>((set) => ({
    chat: undefined,
    history: [],
    setChat: (chat) => set({chat}),
    updateChat: (updatedFields) => set((state) => {
        return {chat: {...state.chat, ...updatedFields}}
    }),
    updateHistory: (msg) => {
        set((state) => ({
            history: Array.isArray(msg) 
                ? [...state.history, ...msg] 
                : [...state.history, msg]    
        }));
    },
    updateTaskList: (updatedTaskList) => set((state) => {
        return {chat: {
            ...state.chat,
            taskList: updatedTaskList
        }}
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
        return { history: newHistory };
    })
}));

export const useChatSelectors = createSelectors(useChatStore);