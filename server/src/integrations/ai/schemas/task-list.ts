import { z } from "zod";

export const TaskListSchema = z.array(
    z.object({
        usedHint: z.boolean(),
        usedSolution: z.boolean(),
        completed: z.boolean(),
        description: z.string(),
        id: z.number()
    })
);

export type TaskList = z.infer<typeof TaskListSchema>;
