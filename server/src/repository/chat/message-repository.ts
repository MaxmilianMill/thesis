import type { GenerateContentConfig } from "@google/genai";
import { ai, MODELS } from "../../integrations/ai/config.js";
import { MessageSchema, type Message } from "../../types/chat/message.js";
import { MongoError, ObjectId } from "mongodb";
import { getDB } from "../../db/config.js";
import { transformMongoDBDoc } from "./utils/transform-chat-doc.js";
import type { WithStatus } from "../../types/utils/with-status.js";

const MESSAGE_COLLECTION = "messages";

async function *generateMessageStream(
    prompt: string,
    config: GenerateContentConfig
): AsyncGenerator<string> {
    
    const response = await ai.models.generateContentStream({
        model: MODELS.FLASH,
        contents: prompt,
        config
    });

    for await (const textChunk of response) {
        if (textChunk.text) yield textChunk.text;
    };
};

/**
 * Updates a chat message. Created a new message object if message does not exist.
 * @param uid 
 * @param chatId 
 * @param messageId 
 * @param updatedFields 
 * @returns 
 */
async function saveOrUpdateMessage(
    uid: string,
    chatId: string,
    messageId: string,
    updatedFields: Partial<Message>
): Promise<WithStatus<"message", Message>> {
    const db = getDB();

    const filter = {_id: new ObjectId(messageId), uid, chatId};
    const update = {$set: {updatedFields}};

    const response = await db
        .collection(MESSAGE_COLLECTION)
        .findOneAndUpdate(
            filter,
            update,
            { returnDocument: "after", upsert: true}
        );

    if (!response)
        throw new MongoError("No document found.");

    const message = transformMongoDBDoc<Message>(response, MessageSchema);

    return {status: 200, message};
};

export {
    generateMessageStream,
    saveOrUpdateMessage
};