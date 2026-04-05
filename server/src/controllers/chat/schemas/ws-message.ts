import z from "zod";
import { MessageSchema } from "../../../types/chat/message.js";

export const WSMessageSchema = z.object({
    uid: z.uuid(),
    chatId: z.string(),
    message: MessageSchema.optional(),
    history: z.array(MessageSchema).optional()
});

export type WSMessage = z.infer<typeof WSMessageSchema>;