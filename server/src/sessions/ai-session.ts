import { EventEmitter } from "events";
import type { UserInfo } from "../types/setup/user-info.js";
import type { AISessionService } from "../services/chat/ai-session-service.js";
import type { Chat } from "../types/chat/chat.js";
import type { Message } from "../types/chat/message.js";

const AI_WS_URL = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key=${process.env.GEMINI_API_KEY}`;

export class AISession extends EventEmitter {

    private ws: WebSocket;

    constructor(
        public sessionService: AISessionService,
        public userInfo: UserInfo
    ) {
        super();
        this.ws = new WebSocket(AI_WS_URL);
        this.sessionService = sessionService;
        this.userInfo = userInfo;

        this.initialize();
    }

    initialize() {
        this.ws.onopen = () => {
            const systemInstruction = this.sessionService.buildSystemInstruction();
            this.ws.send(systemInstruction);
            this.emit("ai_ready");

            console.log("Live API connected.")
        };

        this.ws.onmessage = async (event) => {

            console.log("Receiving data...");
            let rawData = event.data;

            // Unwrap the Blob into a string
            if (rawData instanceof Blob) {
                rawData = await rawData.text();
            } else if (Buffer.isBuffer(rawData)) {
                // Just in case you switch back to the 'ws' npm package later
                rawData = rawData.toString();
            }

            const response = JSON.parse(rawData);
            console.log("Response: ", response);

            if (response.serverContent) {

                const serverContent = response.serverContent;
                let audioChunk: string = "";
                let textChunk: string = "";

                // Receiving Audio
                if (serverContent.modelTurn?.parts) {
                    for (const part of serverContent.modelTurn.parts) {
                        if (part.inlineData) {
                        const audioData = part.inlineData.data; // Base64 encoded string
                        // Process or play audioData
                        console.log(`Received audio data (base64 len: ${audioData.length})`);
                        }
                    }
                }

                // Receiving Text Transcriptions
                if (serverContent.inputTranscription) {
                    console.log('User:', serverContent.inputTranscription.text);
                }

                if (serverContent.outputTranscription) {
                    textChunk = serverContent.outputTranscription.text;
                    console.log('Gemini:', serverContent.outputTranscription.text);
                }

                this.emit("ai_msg", audioChunk, textChunk);
            }
        };

        // Add the error listener
        this.ws.onerror = (error) => {
            console.error("🚨 Gemini WebSocket Error:", error);
        };

        // Update the close listener to print the exact reason
        this.ws.onclose = (event) => {
            // Note: If using the 'ws' npm package, event might just be the code.
            // If it's a standard close event, it has event.code and event.reason
            const reason = event.reason ? event.reason.toString() : "No reason provided";
            console.log(`🔌 Gemini connection closed. Code: ${event.code}, Reason: ${reason}`);
            this.emit("disconnected");
        };
    };

    close() {
        this.ws.close();
    }

    handleSendTextMessage(
        chat: Chat,
        message?: Message,
        history?: Message[]
    ) {
        this.sessionService.sendTextMessage(
            this.ws,
            chat,
            message,
            history
        );
    };
}