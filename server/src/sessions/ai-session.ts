import { EventEmitter } from "events";
import type { UserInfo } from "@thesis/types";
import type { AISessionService } from "../services/chat/ai-session-service.js";
import type { Chat } from "@thesis/types";
import type { Message } from "@thesis/types";

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

            let rawData = event.data;

            // Unwrap the Blob into a string
            if (rawData instanceof Blob) {
                rawData = await rawData.text();
            } else if (Buffer.isBuffer(rawData)) {
                rawData = rawData.toString();
            }

            const response = JSON.parse(rawData);
            console.log("Response: ", response);

            if (response.serverContent) {

                const serverContent = response.serverContent;

                if (serverContent.modelTurn?.parts) {
                    for (const part of serverContent.modelTurn.parts) {
                        if (part.inlineData) {
                            this.emit("ai_msg", { type: "audio", data: part.inlineData.data });
                        }
                    }
                }

                if (serverContent.inputTranscription) {
                    this.emit("ai_msg", {
                        type: "user_msg",
                        data: serverContent.inputTranscription.text
                    });
                }

                if (serverContent.outputTranscription) {
                    this.emit("ai_msg", {
                        type: "ai_msg",
                        data: serverContent.outputTranscription.text
                    });
                }

                if (serverContent.turnComplete) {
                    this.emit("turn_complete");
                }
            }
        };

        // Add the error listener
        this.ws.onerror = (error) => {
            console.error("🚨 Gemini WebSocket Error:", error);
        };

        // Update the close listener to print the exact reason
        this.ws.onclose = (event) => {
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

    handleAudioChunk(base64Audio: string) {
        this.sessionService.sendAudioMessage(this.ws, base64Audio);
    }

    handleRecordingStart(chat: Chat, history?: Message[]) {
        this.sessionService.sendActivityStart(this.ws, chat, history);
    }

    handleRecordingStop() {
        this.sessionService.sendActivityEnd(this.ws);
    }
}