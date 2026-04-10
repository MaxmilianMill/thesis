import { WebSocketServer, type WebSocket } from "ws";
import type { Server } from "http";
import { ChatService } from "../../services/chat/chat-service.js";
import { InfoService } from "../../services/setup/info-service.js";
import { ChatSession } from "../../sessions/chat-session.js";
import * as url from "url";
import { AISessionService } from "../../services/chat/ai-session-service.js";

export function initializeChatSocket(httpServer: Server) {
    console.log("Initializing Websocket...")

    try {

        const wss = new WebSocketServer({
            server: httpServer,
            path: "/ws/chat"
        });

        console.log(`WebSocket server created on path: /ws/chat`);

        wss.on("connection", async (ws: WebSocket, req) => {

            try {

                console.log(`WebSocket connection from ${req.socket.remoteAddress}`);
                console.log("WebSocket connection established");

                const { query } = url.parse(req.url || "", true);
                const chatId = query.chatId as string;
                const uid = query.uid as string;

                if (!chatId || !uid) {
                    console.error("Missing credentials in WebSocket URL");
                    ws.close(1008, "Policy Violation: Missing chatId or userId");
                    return;
                }
            
                const chatService = new ChatService();
                const infoService = new InfoService();

                const [
                    userInfo,
                    chat
                ] = await Promise.all([
                    infoService.getUserData(uid),
                    chatService.get(uid, chatId)
                ]);

                if (!chat.chat)
                    throw new Error("Chat does not exist.");

                const aiSessionService = new AISessionService(userInfo.userInfo);

                const session = new ChatSession(
                    ws,
                    aiSessionService,
                    userInfo.userInfo,
                    chat.chat
                );
            } catch (error) {
                console.error("Failed to initialize session data: ", error);
                ws.close(1011, "Internal server error during setup");
            }
        });

        wss.on("error", (error) => {
            console.error("WebSocket server error:", error);
        });

        console.log("WebSocket initialization completed successfully");
    } catch (error) {
        console.error("Failed to initialize WebSocket:", error);
    }
};