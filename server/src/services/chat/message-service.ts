import { saveMessage } from "../../repository/chat/message-repository.js";
import type { Message } from "@thesis/types";

type StoredMessage = Omit<Message, 'id'> & { chatId: string };

export class MessageService {
    async save(message: StoredMessage): Promise<Message | undefined> {
        // just a quick fix to ensure websocket conn is not broken mid convo.
        try {
            const { message: saved } = await saveMessage(message);
            return saved;
        } catch (error) {
            console.error(error)
        }
    }
}
