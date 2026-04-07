import type { GenerateContentConfig } from "@google/genai";
import { ai, MODELS } from "../../integrations/ai/config.js";

async function improveVersion(
    prompt: string,
    config: GenerateContentConfig
): Promise<string | undefined> {
    const response = await ai.models.generateContent({
        model: MODELS.FLASH,
        contents: prompt,
        config
    });

    return response.text;
};

export {
    improveVersion
}