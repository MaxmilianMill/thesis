import { GoogleGenAI, type GenerateContentConfig } from "@google/genai";
import { ai, MODELS } from "../../integrations/ai/config.js";
import { ObjectId, MongoError } from "mongodb";
import { getDB } from "../../db/config.js";
import type { TaskList } from "../../integrations/ai/schemas/task-list.js";
import { CHAT_COLLECTION } from "./chat-repository.js";
import type { WithStatus } from "../../types/utils/with-status.js";
import type { Message } from "../../types/chat/message.js";

/**
 * Generates a task list for a specific scenario and returns the raw output string.
 * @param prompt 
 * @param config 
 * @returns 
 */
async function generateTaskList(
    prompt: string,
    config: GenerateContentConfig
) {
    const response = await ai.models.generateContent({
        model: MODELS.FLASH,
        contents: prompt,
        config
    });

    if (!response.text)
        throw new Error("AI generation failed.")

    return response.text;
};

/**
 * Saves the task list to the chat document of a user.
 * @param uid 
 * @param chatId 
 * @param taskList 
 * @returns 
 */
async function saveTaskList(
    uid: string, chatId: string, taskList: TaskList
): Promise<WithStatus<"taskList", TaskList>> {
    const db = getDB();

    let newChatId;

    if (!chatId)
        newChatId = new ObjectId();

    const filter = {_id: new ObjectId(chatId ?? newChatId), uid: uid};
    const update = {$set: {taskList}};
    const options = {upsert: true};

    const response = await db
        .collection(CHAT_COLLECTION)
        .updateOne(filter, update, options);

    if (response.modifiedCount !== 1) 
        throw new MongoError("No document found to update.");

    return {taskList, status: 201};
};

async function findCompletedTasks(
    prompt: string,
    config: GenerateContentConfig
): Promise<string> {

    const response = await ai.models.generateContent({
        model: MODELS.FLASH,
        contents: prompt,
        config
    });

    if (!response.text)
        throw new Error("Error from gemini api.");

    return response.text;
}

export {
    generateTaskList,
    saveTaskList,
    findCompletedTasks
}