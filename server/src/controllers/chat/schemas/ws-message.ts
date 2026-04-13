import z from "zod";
import { MessageSchema } from "../../../../../packages/types/src/chat/message.js";

export const WSMessageSchema = z.object({
    uid: z.uuid(),
    chatId: z.string(),
    rawAudio: z.base64().optional(),
    message: MessageSchema.optional(),
    history: z.array(MessageSchema).optional(),
    type: z.enum(["audio", "text"])
});

export type WSMessage = z.infer<typeof WSMessageSchema>;