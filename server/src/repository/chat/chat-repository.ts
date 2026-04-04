import { MongoError, ObjectId } from "mongodb";
import { getDB } from "../../db/config.js";
import type { Chat } from "../../types/chat/chat.js";
import { ChatSchema } from "../../types/chat/chat.js";
import type { WithStatus } from "../../types/utils/with-status.js";

export const CHAT_COLLECTION = "chat";

async function updateChat(
    uid: string, 
    chatId: string, 
    updatedFields: Partial<Chat>
): Promise<WithStatus<"chat", Chat>> {

    const db = getDB();

    console.log(updatedFields);
    
    const filter = {_id: new ObjectId(chatId), uid: uid};
    const update = {$set: {...updatedFields}};
    
    const response = await db
        .collection(CHAT_COLLECTION)
        .findOneAndUpdate(filter, update, { returnDocument: 'after' });

    if (!response) 
        throw new MongoError("No document found.");

    // Transform MongoDB document to match the schema
    const transformedDoc = {
        ...response,
        id: response._id.toString(),
        _id: undefined,
    };

    // Validate and type the document
    const parseResult = ChatSchema.safeParse(transformedDoc);
    if (!parseResult.success) {
        throw new Error(`Invalid chat document: ${parseResult.error.message}`);
    }

    return { chat: parseResult.data, status: 200 };
};

async function addChat(
    uid: string,
    partialChat: Omit<Chat, "createdAt">
): Promise<WithStatus<"chat", Chat>> {

    const db = getDB();

    const chat: Chat = {...partialChat, createdAt: new Date()};

    const response = await db
        .collection(CHAT_COLLECTION)
        .insertOne(chat);

    if (!response.acknowledged)
        throw new MongoError("Unable to add document");

    return {chat, status: 201};
};

export {
    updateChat,
    addChat
};