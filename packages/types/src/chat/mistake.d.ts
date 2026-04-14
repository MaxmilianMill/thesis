import { z } from 'zod';
export declare const MistakeSchema: z.ZodObject<{
    explanation: z.ZodString;
    type: z.ZodEnum<{
        grammar: "grammar";
        spelling: "spelling";
        formulation: "formulation";
    }>;
}, z.core.$strip>;
export type Mistake = z.infer<typeof MistakeSchema>;
//# sourceMappingURL=mistake.d.ts.map