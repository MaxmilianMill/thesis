import { z } from "zod";
import { MessageSchema } from "./message.js";

export const WSMessageSchema = z.object({
    uid: z.uuid(),
    chatId: z.string(),
    rawAudio: z.base64().optional(),
    message: MessageSchema.optional(),
    history: z.array(z.object({
        text: z.string(),
        isUser: z.boolean(),
        id: z.string().optional(),
        uid: z.string().optional(),
        createdAt: z.union([z.string(), z.date()]).optional(),
        improvedVersion: z.string().optional(),
        isCorrect: z.boolean().optional(),
        isTutor: z.boolean().optional(),
    }).passthrough()).optional(),
    taskId: z.number().optional(),
    type: z.enum([
        "audio",
        "text",
        "recording_start",
        "recording_stop",
        "hint_used",
        "solution_used"
    ])
});

export type WSMessage = z.infer<typeof WSMessageSchema>;