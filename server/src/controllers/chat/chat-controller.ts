import type { AuthRequest } from "../../middlewares/auth-handler.js";
import type { ChatService } from "../../services/chat/chat-service.js";
import type { Request, Response } from "express";

export class ChatController {

    constructor(
        private chatService: ChatService
    ) {}

    public async handleUpdateChat(req: AuthRequest, res: Response) {

        const {uid} = req.authToken;

        const { 
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

    public async handleAddChat(req: AuthRequest, res: Response) {
        const {uid} = req.authToken;

        const {
            chat
        } = req.body;

        const {
            status, 
            chat: savedChat
        } = await this.chatService.create(uid, chat);

        return res.status(status).json({chat: savedChat});
    }
}