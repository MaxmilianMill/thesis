import { z } from "zod";
import { TaskListSchema } from "./task-list.js"
import type { Scenario } from "../setup/scenario.js";

export const ChatSchema = z.object({
    id: z.string(),
    taskList: TaskListSchema,
    completed: z.boolean(),
    score: z.number().optional(),
    uid: z.uuid(),
    createdAt: z.coerce.date(),
    condition: z.enum(["warmup", "control", "experiment"]),
});

export type Chat = z.infer<typeof ChatSchema> & {scenario: Scenario};