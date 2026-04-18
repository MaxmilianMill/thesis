import WebSocket from "ws";
import { ClientSession } from "./client-session.js";
import { AISession } from "./ai-session.js";
import type { AISessionService } from "../services/chat/ai-session-service.js";
import type { UserInfo } from "@thesis/types";
import type { WSMessage } from "@thesis/types"
import type { Chat } from "@thesis/types";
import type { FeedbackService } from "../services/chat/feedback-service.js";

export class ChatSession {
    client: ClientSession;
    ai: AISession | undefined;

    constructor(
        client: WebSocket,
        public aiSessionService: AISessionService,
        public feedbackService: FeedbackService,
        public userInfo: UserInfo,
        public chat: Chat
    ) {
        this.client = new ClientSession(client);
        this.ai = new AISession(aiSessionService, userInfo);

        this.initializeListeners();
    };

    initializeListeners() {
        this.client.on('user_msg', async (data: WSMessage) => {
            if (data.type === "recording_start") {
                this.ai?.handleRecordingStart(this.chat, data.history);
                return;
            }

            if (data.type === "recording_stop") {
                this.ai?.handleRecordingStop();
                return;
            }

            if (data.type === "audio" && data.rawAudio) {
                this.ai?.handleAudioChunk(data.rawAudio);
                return;
            }

            if (data.type === "text") {
                this.ai?.handleSendTextMessage(this.chat, data.message, data.history);

                if (!data.message) return;

                await this.client.generateFeedback({
                    userInfo: this.userInfo,
                    chat: this.chat,
                    message: data.message,
                    history: data.history
                });
            }
        });

        // When we receive feedback
        this.client.on("feedback", (feedback) => {
            this.client.sendFeedback(feedback);
        });

        this.ai?.on('ai_msg', (aiResponse) => {
            this.client.sendAIResponse(aiResponse);
        });

        this.ai?.on('turn_complete', () => {
            this.client.sendAIResponse({ type: "done", data: null });
        });

        // Robust Cleanup (If one dies, kill the other)
        this.client.on('disconnected', () => {
            console.log("User left. Shutting down AI.");
            this.ai?.close();
        });

        this.ai?.on('disconnected', () => {
            console.log("AI connection dropped. Disconnecting user.");
            this.client.close();
        });
    }
}