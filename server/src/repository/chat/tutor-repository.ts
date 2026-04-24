import type { GenerateContentConfig } from "@google/genai";
import { ai, MODELS } from "../../integrations/ai/config.js";

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

export {
    generateTutorAnswer
}