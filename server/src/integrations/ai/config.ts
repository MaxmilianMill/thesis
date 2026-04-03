import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

const MODELS = {
    FLASH: "gemini-3-flash-preview",
    LITE: ""
};

export {
    ai,
    MODELS
};