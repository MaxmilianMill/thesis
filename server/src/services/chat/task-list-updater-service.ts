import type { GenerateContentConfig } from "@google/genai";
import type { Chat } from "@thesis/types";
import type { Message } from "@thesis/types";
import z from "zod";
import { TaskListUpdateSchema } from "./schemas/task-list-update.js";
import { findCompletedTasks } from "../../repository/chat/task-list-repository.js";

export class TaskListUpdaterService {
    
    public async update(message: Message, chat: Chat) {

        const prompt = this.buildPrompt(message, chat);
        const config = this.getConfig();

        const rawResponse = await findCompletedTasks(
            prompt, config
        );

        const updatedTaskIds = this.validate(rawResponse);
        return this.updateTasksInChat(updatedTaskIds, chat);
    };

    private updateTasksInChat(taskIds: number[], chat: Chat) {
        const updatedTaskList = chat.taskList.map((task) => {
            if (taskIds.includes(task.id)) 
                return {
                    ...task,
                    completed: true
                };

            return task;
        });

        return updatedTaskList;
    };

    private validate(rawResponse: string) {

        const jsonResponse = JSON.parse(rawResponse);
        const validatedResponse = TaskListUpdateSchema.safeParse(jsonResponse);

        if (!validatedResponse.success)
            throw new Error(validatedResponse.error.message);

        return validatedResponse.data;
    };

    private buildPrompt(
        message: Message,
        chat: Chat
    ) {
        const incompleteTasks = chat.taskList?.filter(t => !t.completed) || [];

        const taskListString = incompleteTasks.map(t =>
            `- ID ${t.id}: ${t.description} (Target/Hint: ${t.hint.text})`
        ).join("\n");

        return `
            GAME REFEREE INSTRUCTIONS:
            The user has active mission objectives. Analyze their message against this list:
            ${taskListString}
        
            - Check if the user completed ANY of these objectives in their message.
            - The user can complete multiple tasks in one turn.
            - The user can complete tasks out of order.
            - Be lenient: If they convey the correct intent/meaning (even with synonyms), mark it as completed.

            This is the user message: ${message.text}
        `;
    };

    private getConfig(): GenerateContentConfig {
        return {
            temperature: 0.5,
            responseMimeType: "application/json",
            responseJsonSchema: z.toJSONSchema(TaskListUpdateSchema)
        }
    };
}