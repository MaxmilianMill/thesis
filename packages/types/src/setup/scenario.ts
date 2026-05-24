import { z } from "zod";

export const ScenarioSchema = z.object({
    id: z.string().optional(),
    title: z.string(),
    aiDescription: z.string(),
    userDescription: z.string(),
    imgPath: z.string().optional(),
});

export type Scenario = z.infer<typeof ScenarioSchema>;