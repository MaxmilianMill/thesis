import { addChat, getChat, updateChat } from "../../repository/chat/chat-repository.js";
import type { Chat } from "../../types/chat/chat.js";

export class ChatService {

    async update(
        uid: string, 
        chatId: string, 
        updatedFields: Partial<Chat>
    ) {
        // Filter out null/undefined values to prevent MongoDB $set errors
        const cleanFields = this.removeNullUndefined(updatedFields);
        return await updateChat(uid, chatId, cleanFields);
    };

    async create(
        uid: string,
        chat: Omit<Chat, "createdAt">
    ) {
        return await addChat(uid, chat);
    };

    async get(uid: string, chatId: string) {
        return await getChat(uid, chatId);
    };

    private removeNullUndefined<T extends Record<string, any>>(obj: T): Partial<T> {
        const cleaned: Partial<T> = {};
        for (const [key, value] of Object.entries(obj)) {
            if (value !== null && value !== undefined) {
                cleaned[key as keyof T] = value;
            }
        }
        return cleaned;
    }
};