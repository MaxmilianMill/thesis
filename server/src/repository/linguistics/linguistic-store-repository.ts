import { MongoError, ObjectId } from "mongodb";
import { getDB } from "../../db/config.js";
import type { LinguisticStore, WithStatus } from "@thesis/types";
import { LinguisticStoreSchema } from "@thesis/types";
import { transformMongoDBDoc } from "../chat/utils/transform-chat-doc.js";
import type { GenerateContentConfig } from "@google/genai";
import { ai, MODELS } from "../../integrations/ai/config.js";

const LINGUISTIC_STORE_COLLECTION = "linguistic_store";

async function getLinguisticStore(
    uid: string
): Promise<WithStatus<"store", LinguisticStore | undefined>> {
    const db = getDB();

    const query = {uid};

    const response = await db
        .collection(LINGUISTIC_STORE_COLLECTION)
        .findOne(query)

    if (!response)
        return {store: undefined, status: 200};

    const store = transformMongoDBDoc<LinguisticStore>(response, LinguisticStoreSchema);

    return {store, status: 200};
}

async function generateLinguisticAnalysis(
    contents: string,
    config: GenerateContentConfig
) {

    const response = await ai.models.generateContent({
        model: MODELS.FLASH,
        contents,
        config
    });

    if (!response.text)
        throw new Error("Unable to generate linguistic analysis.");

    return response.text;
}

/**
 * Updates the linguistic store doc or created a new one.
 * @param uid 
 * @param chatId 
 * @param updatedFields 
 * @returns 
 */
async function saveOrUpdateLinguisticStore(
    uid: string,
    chatId: string,
    updatedFields: Partial<LinguisticStore>
): Promise<WithStatus<"data", LinguisticStore>> {
    const db = getDB();

    const query = {uid};

    const { references, ...fieldsToSet } = updatedFields;

    const updater = {
        $set: {
            ...fieldsToSet,
            uid: uid
        },
        $addToSet: { "references": chatId } 
    };

    const response = await db
        .collection(LINGUISTIC_STORE_COLLECTION)
        .findOneAndUpdate(
            query, 
            updater,
            { 
                upsert: true, 
                returnDocument: 'after'
            }
        )

    if (!response) 
        throw new Error("Error creating or updating linguistic store.");

    const data = transformMongoDBDoc<LinguisticStore>(
        response, LinguisticStoreSchema
    );

    return {status: 200, data};
}

export {
    getLinguisticStore,
    generateLinguisticAnalysis,
    saveOrUpdateLinguisticStore
}