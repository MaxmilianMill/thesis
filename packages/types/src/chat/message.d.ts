import { z } from 'zod';
export declare const MessageSchema: z.ZodObject<{
    text: z.ZodString;
    audioUrl: z.ZodOptional<z.ZodString>;
    isUser: z.ZodBoolean;
    id: z.ZodString;
    uid: z.ZodString;
    createdAt: z.ZodCoercedDate<unknown>;
    improvedVersion: z.ZodOptional<z.ZodString>;
    isCorrect: z.ZodOptional<z.ZodBoolean>;
    mistakes: z.ZodOptional<z.ZodArray<z.ZodObject<{
        explanation: z.ZodString;
        type: z.ZodEnum<{
            grammar: "grammar";
            spelling: "spelling";
            formulation: "formulation";
        }>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export type Message = z.infer<typeof MessageSchema>;
//# sourceMappingURL=message.d.ts.map