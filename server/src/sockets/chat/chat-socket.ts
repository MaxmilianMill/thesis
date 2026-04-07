import { WebSocketServer, type WebSocket } from "ws";
import type { Server } from "http";
import { ChatController } from "../../controllers/chat/chat-controller.js";
import { ChatService } from "../../services/chat/chat-service.js";
import { MessageService } from "../../services/chat/message-service.js";
import { InfoService } from "../../services/setup/info-service.js";
import { FeedbackService } from "../../services/chat/feedback-service.js";
import { TaskListUpdaterService } from "../../services/chat/task-list-updater-service.js";
import { ChatSession } from "./chat-session.js";

export function initializeChatSocket(httpServer: Server) {
    console.log("Initializing Websocket...")

    try {
        // Create dependencies internally
        const chatService = new ChatService();
        const messageService = new MessageService();
        const infoService = new InfoService();
        const feedbackService = new FeedbackService();
        const taskListUpdateService = new TaskListUpdaterService();

        const chatController = new ChatController(
            chatService,
            messageService,
            infoService,
            feedbackService,
            taskListUpdateService
        );

        const wss = new WebSocketServer({
            server: httpServer,
            path: "/ws/chat"
        });

        console.log(`WebSocket server created on path: /ws/chat`);

        wss.on("connection", (ws: WebSocket, req) => {
            console.log(`WebSocket connection from ${req.socket.remoteAddress}`);
            console.log("WebSocket connection established");

            const session = new ChatSession(ws);

            chatController.handleMessage(session).catch((error) => {
                console.error("Unhandled connection error: ", error);
                ws.close(1011, "Internal server error")
            });
        });

        wss.on("error", (error) => {
            console.error("WebSocket server error:", error);
        });

        console.log("WebSocket initialization completed successfully");
    } catch (error) {
        console.error("Failed to initialize WebSocket:", error);
    }
};