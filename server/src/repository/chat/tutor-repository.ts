import type { GenerateContentConfig } from "@google/genai";
import { ai, MODELS } from "../../integrations/ai/config.js";
import { type TutorResponse, type WithStatus } from "@thesis/types";
import { getDB } from "../../db/config.js";
import { MongoError } from "mongodb";

const TUTOR_RESPONSE_COLLECTION = "tutor_response";

async function generateTutorAnswer(
    contents: string,
    config: GenerateContentConfig
): Promise<string> {

    const response = await ai.models.generateContent({
        model: MODELS.FLASH,
        contents,
        config
    });

    if (!response.text)
        throw new Error("AI generation failed.");

    return response.text;
}

async function saveTutorAnswer(
    tutorResponse: Omit<TutorResponse, "id">
) {
    const db = getDB();

    const response = await db
        .collection(TUTOR_RESPONSE_COLLECTION)
        .insertOne(tutorResponse);

    if (!response)
        throw new MongoError("Unable to insert tutor response");

    return {
        ...tutorResponse,
        id: response.insertedId.toString()
    };
}

async function getTutorAnswers(
    uid: string
): Promise<WithStatus<"data", TutorResponse[]>> {

    const db = getDB();

    const filter = { uid: uid };

    const cursor = db
        .collection<TutorResponse>(TUTOR_RESPONSE_COLLECTION)
        .find(filter);

    const response = await cursor.toArray();

    const data = response.map((tr) => {
        return {
            ...tr,
            id: tr._id.toString()
        }
    });

    return { status: 200, data };
};

export {
    generateTutorAnswer,
    saveTutorAnswer,
    getTutorAnswers
}