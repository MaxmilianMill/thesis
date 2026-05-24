import type { GenerateContentConfig } from "@google/genai";
import { ai, MODELS } from "../../integrations/ai/config.js";
import { SummarySchema, type Summary } from "@thesis/types";
import { getDB } from "../../db/config.js";
import { transformMongoDBDoc } from "../chat/utils/transform-chat-doc.js";
import { MongoError, ObjectId } from "mongodb";
import type { WithStatus } from "@thesis/types";

const SUMMARY_COLLECTION = "summary";

async function generateSummary(
    contents: string,
    config: GenerateContentConfig
) {
    const response = await ai.models.generateContent({
        model: MODELS.FLASH,
        contents,
        config
    });

    if (!response.text)
        throw new Error(`Error generating summary with response id: ${response.responseId}`)

    return response.text;
};

async function saveOrUpdateSummary(
    uid: string,
    chatId: string,
    updatedFields: Summary | Partial<Summary>
): Promise<WithStatus<"summary", Summary>> {
    const db = getDB();

    const filter = {
        chatId: chatId, 
        uid: uid
    };

    const update = {$set: updatedFields};

    const response = await db
        .collection(SUMMARY_COLLECTION)
        .findOneAndUpdate(
            filter,
            update,
            { returnDocument: "after", upsert: true}
        );

    if (!response)
        throw new MongoError("Unable to create/update summary.")

    const summary = transformMongoDBDoc<Summary>(response, SummarySchema);

    return {status: 201, summary};
}

export {
    generateSummary,
    saveOrUpdateSummary
}