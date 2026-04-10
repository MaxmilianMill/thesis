import z from "zod";
import { MessageSchema } from "../../../types/chat/message.js";

export const WSMessageSchema = z.object({
    uid: z.uuid(),
    chatId: z.string(),
    rawAudio: z.base64().optional(),
    message: MessageSchema.optional(),
    history: z.array(MessageSchema).optional(),
    type: z.enum(["audio", "text"])
});

export type WSMessage = z.infer<typeof WSMessageSchema>;