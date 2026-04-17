import type { Chat, Message, TaskList } from "@thesis/types";
import { create } from "zustand";
import { createSelectors } from "./utils/createSelectors";

interface ChatState {
    chat: Chat | undefined;
    history: Message[];
    setChat: (chat: Chat) => void;
    updateChat: (updatedFields: Partial<Chat>) => void;
    updateHistory: (msg: Message | Message[]) => void;
    updateTaskList: (updatedTaskList: TaskList) => void;
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
    })
}));

export const useChatSelectors = createSelectors(useChatStore);