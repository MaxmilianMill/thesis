import type { GenerateContentConfig } from "@google/genai";
import { ai, MODELS } from "../../integrations/ai/config.js";

async function *generateAudioMessageStream(
    contents: string,
    config: GenerateContentConfig
): AsyncGenerator<string> {

    const response = await ai.models.generateContentStream({
        model: MODELS.TTS,
        contents,
        config
    });

    for await (const audioChunk of response) {
        if (audioChunk.text) yield audioChunk.text;
    };
};

export {
    generateAudioMessageStream
};