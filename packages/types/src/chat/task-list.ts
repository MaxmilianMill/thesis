import { z } from "zod";

const TaskSchema = z.object({
    hint: z.object({
        text: z.string("A usedful hint to solve the task."),
        used: z.boolean("Defines if user already used the hint. False by default.").default(false)
    }),
    solution: z.object({
        text: z.string("A examplary solution for the task."),
        used: z.boolean("Defines if user already used the solution. False by default.").default(false)
    }),
    completed: z.boolean(),
    description: z.string(),
    id: z.number()
});

const TaskListSchema = z.array(TaskSchema);

export {
    TaskSchema,
    TaskListSchema
};

type Task = z.infer<typeof TaskSchema>;
type TaskList = z.infer<typeof TaskListSchema>;

export type {
    Task,
    TaskList
};
