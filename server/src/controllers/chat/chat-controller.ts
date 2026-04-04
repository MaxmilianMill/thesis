import type { ChatService } from "../../services/chat/chat-service.js";
import type { Request, Response } from "express";

export class ChatController {

    constructor(private chatService: ChatService) {}

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
}