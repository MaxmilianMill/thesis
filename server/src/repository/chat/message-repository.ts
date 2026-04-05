import type { GenerateContentConfig } from "@google/genai";
import { ai, MODELS } from "../../integrations/ai/config.js";

async function *generateMessageStream(
    prompt: string,
    config: GenerateContentConfig
): AsyncGenerator<string> {
    
    const response = await ai.models.generateContentStream({
        model: MODELS.FLASH,
        contents: prompt,
        config
    });

    for await (const textChunk of response) {
        if (textChunk.text) yield textChunk.text;
    };
};

export {
    generateMessageStream
};