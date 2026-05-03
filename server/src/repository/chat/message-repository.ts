import type { GenerateContentConfig } from "@google/genai";
import { ai, MODELS } from "../../integrations/ai/config.js";
import { MessageSchema, type Message } from "@thesis/types";
import { MongoError, ObjectId } from "mongodb";
import { getDB } from "../../db/config.js";
import { transformMongoDBDoc } from "./utils/transform-chat-doc.js";
import type { WithStatus } from "@thesis/types";

const MESSAGE_COLLECTION = "messages";

async function *generateMessageStream(
    prompt: string,
    config: GenerateContentConfig
): AsyncGenerator<string> {
    
    const response = await ai.models.generateContentStream({
        model: "gemini-2.5-flash-preview-tts",
        contents: prompt,
        config
    });

    for await (const textChunk of response) {
        if (textChunk.text) yield textChunk.text;

        const audioChunk = textChunk.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

        if (audioChunk) {
            const audioBuffer = Buffer.from(audioChunk, "base64");
            console.log(audioBuffer.toString().slice(0, 10));
        };
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
    updatedFields: Message | Partial<Message>
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

/**
 * Returns all messages for a specific chat is descending order.
 * @param uid 
 * @param chatId 
 * @returns 
 */
async function getChatMessages(
    uid: string, chatId: string
): Promise<WithStatus<"messages", Message[]>>  {
    const db = getDB();

    const query = {uid, chatId};

    const cursor = db
        .collection(MESSAGE_COLLECTION)
        .find(query)
        .sort({createdAt: "desc"});

    const response = await cursor.toArray();

    const messages = response.map((msg) => {
        return transformMongoDBDoc<Message>(msg, MessageSchema)
    });

    return {status: 200, messages: messages}
}

export {
    generateMessageStream,
    saveOrUpdateMessage,
    getChatMessages
};