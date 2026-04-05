import type { ChatService } from "../../services/chat/chat-service.js";
import type { Request, Response } from "express";
import WebSocket from "ws";
import type { MessageService } from "../../services/chat/message-service.js";
import { WSMessageSchema, type WSMessage } from "./schemas/ws-message.js";

export class ChatController {

    constructor(
        private chatService: ChatService,
        private messageService: MessageService
    ) {}

    async handleUpdateChat(req: Request, res: Response) {

        const {
            uid, 
            chatId,
            updatedFields
        } = req.body;

        const {
            status,
            chat
        } = await this.chatService.update(
            uid,
            chatId,
            updatedFields
        );

        return res.status(status).json({chat});
    };

    async handleAddChat(req: Request, res: Response) {
        const {
            uid,
            chat
        } = req.body;

        const {
            status, 
            chat: savedChat
        } = await this.chatService.create(uid, chat);

        return res.status(status).json({chat: savedChat});
    }

    async handleMessage(ws: WebSocket) {
        
        ws.on("message", async (message: Buffer) => {

            const {
                uid,
                chatId,
                message: _message,
                history
            } = this.parseWSMessage(message);

            await this.messageService.answerStream(
                uid,
                chatId,
                (textChunk: string) => {
                    ws.send(JSON.stringify({type: "text", data: textChunk}))
                },
                _message,
                history
            );

            ws.send(JSON.stringify({type: "done"}));
        })
    }

    private parseWSMessage(message: Buffer): WSMessage {

        const rawMessage = JSON.parse(message.toString());

        const validatedMessage = WSMessageSchema.safeParse(rawMessage);

        if (!validatedMessage.success)
            throw new Error(validatedMessage.error.message);

        return validatedMessage.data
    }
}