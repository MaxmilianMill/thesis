import type { GenerateContentConfig } from "@google/genai";
import { ai, MODELS } from "../../integrations/ai/config.js";
import type { TutorResponse } from "@thesis/types";
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

export {
    generateTutorAnswer,
    saveTutorAnswer
}