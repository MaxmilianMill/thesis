import { WebSocketServer } from "ws";
import type { Server } from "http";
import { ChatController } from "../../controllers/chat/chat-controller.js";
import { ChatService } from "../../services/chat/chat-service.js";
import { MessageService } from "../../services/chat/message-service.js";

export function initializeChatSocket(httpServer: Server) {
    console.log("Initializing Websocket...")

    try {
        // Create dependencies internally
        const chatService = new ChatService();
        const messageService = new MessageService();

        const chatController = new ChatController(
            chatService,
            messageService
        );

        const wss = new WebSocketServer({
            server: httpServer,
            path: "/ws/chat"
        });

        console.log(`WebSocket server created on path: /ws/chat`);

        wss.on("connection", (ws, req) => {
            console.log(`WebSocket connection from ${req.socket.remoteAddress}`);
            console.log("WebSocket connection established");

            chatController.handleMessage(ws);
        });

        wss.on("error", (error) => {
            console.error("WebSocket server error:", error);
        });

        console.log("WebSocket initialization completed successfully");
    } catch (error) {
        console.error("Failed to initialize WebSocket:", error);
    }
};