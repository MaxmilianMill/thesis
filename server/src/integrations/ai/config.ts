import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

const MODELS = {
    FLASH: "gemini-3-flash-preview",
    LITE: "",
    TTS: "gemini-2.5-flash-preview-tts",
    LIVE: "gemini-2.5-flash-native-audio-preview-12-2025"
};

export {
    ai,
    MODELS
};