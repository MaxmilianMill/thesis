import { z } from 'zod';

export const MistakeSchema = z.object({
    explanation: z.string(),
    type: z.enum(["grammar", "spelling", "formulation"])
});

export type Mistake = z.infer<typeof MistakeSchema>;