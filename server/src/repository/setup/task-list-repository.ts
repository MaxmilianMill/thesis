import type { GenerateContentConfig } from "@google/genai";
import { ai, MODELS } from "../../integrations/ai/config.js";

async function createTaskList(
    prompt: string,
    config: GenerateContentConfig
) {
    const response = await ai.models.generateContentStream({
        model: MODELS.FLASH,
        contents: prompt,
        config
    });

    for await (const chunk of response) {
        console.log(chunk.text);
    };
};

export {
    createTaskList
}