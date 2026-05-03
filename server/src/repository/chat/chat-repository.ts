import { MongoError, ObjectId } from "mongodb";
import { getDB } from "../../db/config.js";
import type { Chat } from "@thesis/types";
import { ChatSchema } from "@thesis/types";
import type { WithStatus } from "@thesis/types";
import { transformMongoDBDoc } from "./utils/transform-chat-doc.js";
import { getUserByUid } from "../auth/user-repository.js";

export const CHAT_COLLECTION = "chat";

async function updateChat(
    uid: string, 
    chatId: string, 
    updatedFields: Partial<Chat>
): Promise<WithStatus<"chat", Chat>> {

    const db = getDB();
    
    const filter = {_id: new ObjectId(chatId), uid: uid};
    const update = {$set: {...updatedFields}};
    
    const response = await db
        .collection(CHAT_COLLECTION)
        .findOneAndUpdate(filter, update, { returnDocument: 'after' });

    if (!response) 
        throw new MongoError("No document found.");

    const transformedData = transformMongoDBDoc<Chat>(response, ChatSchema)

    return { chat: transformedData, status: 200 };
};

function deriveCondition(
    group: "control_first" | "experiment_first",
    existingCount: number
): "warmup" | "control" | "experiment" {
    if (existingCount === 0) return "warmup";
    if (group === "control_first") return existingCount % 2 === 1 ? "control" : "experiment";
    return existingCount % 2 === 1 ? "experiment" : "control";
}

async function addChat(
    uid: string,
    partialChat: Omit<Chat, "createdAt" | "id" | "completed" | "condition">
): Promise<WithStatus<"chat", Chat>> {

    const db = getDB();

    const [existingCount, user] = await Promise.all([
        countChats(uid),
        getUserByUid(uid)
    ]);

    const group = user?.group ?? "control_first";
    const condition = deriveCondition(group, existingCount);

    const chatDoc: Omit<Chat, "id"> = {
        ...partialChat,
        condition,
        createdAt: new Date(),
        completed: false,
        uid
    };

    const response = await db
        .collection(CHAT_COLLECTION)
        .insertOne(chatDoc);

    if (!response.acknowledged)
        throw new MongoError("Unable to add document");

    const chat: Chat = {
        ...chatDoc,
        id: response.insertedId.toString()
    };

    return {chat, status: 201};
};

async function getChat(
    uid: string,
    chatId: string
): Promise<WithStatus<"chat", Chat | undefined>> {
    
    const db = getDB();

    const query = {_id: new ObjectId(chatId), uid: uid};

    console.log(query);

    const response = await db
        .collection(CHAT_COLLECTION)
        .findOne(query);

    if (!response)
        return {status: 200, chat: undefined};

    const transformedChat = transformMongoDBDoc<Chat>(response, ChatSchema);

    return {status: 200, chat: transformedChat};
}

async function countChats(uid: string): Promise<number> {
    const db = getDB();
    return db.collection(CHAT_COLLECTION).countDocuments({ uid });
}

export {
    updateChat,
    addChat,
    getChat,
    countChats
};