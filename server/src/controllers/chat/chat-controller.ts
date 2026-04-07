import type { ChatService } from "../../services/chat/chat-service.js";
import type { Request, Response } from "express";
import WebSocket from "ws";
import type { MessageService } from "../../services/chat/message-service.js";
import { WSMessageSchema, type WSMessage } from "./schemas/ws-message.js";
import type { InfoService } from "../../services/setup/info-service.js";

export class ChatController {

    constructor(
        private chatService: ChatService,
        private messageService: MessageService,
        private infoService: InfoService
    ) {}

    public async handleUpdateChat(req: Request, res: Response) {

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

    public async handleAddChat(req: Request, res: Response) {
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

    public async handleMessage(ws: WebSocket) {
        
        ws.on("message", async (messageBuffer: Buffer) => {

            const {
                uid,
                chatId,
                message,
                history
            } = this.parseWSMessage(messageBuffer);

            // fetch relevant db docs
            const [
                userInfo,
                chat
            ] = await Promise.all([
                this.infoService.getUserData(uid),
                this.chatService.get(uid, chatId)
            ]);

            if (!chat.chat)
                throw new Error("Chat does not exist.");

            await this.messageService.answerStream(
                userInfo.userInfo,
                chat.chat,
                (textChunk: string) => {
                    ws.send(JSON.stringify({type: "text", data: textChunk}))
                },
                message,
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