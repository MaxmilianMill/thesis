import z from "zod";

export const TaskListUpdateSchema = z.array(
    z.number("The id of each coimpleted task. If no task has been completed, leave the array empty")
);