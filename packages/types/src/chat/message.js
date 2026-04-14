import { z } from 'zod';
import { MistakeSchema } from './mistake.js';
export const MessageSchema = z.object({
    text: z.string(),
    audioUrl: z.string().optional(),
    isUser: z.boolean(),
    id: z.string(),
    uid: z.string(),
    createdAt: z.coerce.date(),
    improvedVersion: z.string().optional(),
    isCorrect: z.boolean().optional(),
    mistakes: z.array(MistakeSchema).optional()
});
//# sourceMappingURL=message.js.map