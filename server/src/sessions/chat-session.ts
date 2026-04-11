import WebSocket from "ws";
import { ClientSession } from "./client-session.js";
import { AISession } from "./ai-session.js";
import type { AISessionService } from "../services/chat/ai-session-service.js";
import type { UserInfo } from "../types/setup/user-info.js";
import type { WSMessage } from "../controllers/chat/schemas/ws-message.js";
import type { Chat } from "../types/chat/chat.js";

export class ChatSession {
    client: ClientSession;
    ai: AISession | undefined;

    constructor(
        client: WebSocket,
        public aiSessionService: AISessionService,
        public userInfo: UserInfo,
        public chat: Chat
    ) {
        this.client = new ClientSession(client);
        this.ai = new AISession(aiSessionService, userInfo);

        this.initializeListeners();
    };

    initializeListeners() {
        // When the user speaks, send it to the AI
        this.client.on('user_msg', (data: WSMessage) => {
            this.ai?.handleSendTextMessage(
                this.chat,
                data.message,
                data.history
            );
        });

        // 2. When the AI responds, send it to the Client
        this.ai?.on('ai_msg', (audio, text) => {

            console.log(audio);

            this.client.sendAIResponse(audio, text);
        });

        // 3. Robust Cleanup (If one dies, kill the other)
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