import type { ChatService } from "../../services/chat/chat-service.js";
import type { Request, Response } from "express";
import type { MessageService } from "../../services/chat/message-service.js";
import { WSMessageSchema, type WSMessage } from "./schemas/ws-message.js";
import type { InfoService } from "../../services/setup/info-service.js";
import type { FeedbackService } from "../../services/chat/feedback-service.js";
import type { TaskListUpdaterService } from "../../services/chat/task-list-updater-service.js";
import type { ChatSession } from "../../sockets/chat/chat-session.js";

export class ChatController {

    constructor(
        private chatService: ChatService,
        private messageService: MessageService,
        private infoService: InfoService,
        private feedbackService: FeedbackService,
        private taskListUpdateService: TaskListUpdaterService
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

    public async handleMessage(session: ChatSession) {
        
        session.onSendMessage(
            async (messageBuffer: Buffer) => {

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
                        session.sendChunk(textChunk)
                    },
                    message,
                    history
                );

                // if the request contains a user message, we generate the feedback
                if (message) {
                    const updatedMessage = await this.feedbackService.generateFeedback({
                        userInfo: userInfo.userInfo,
                        chat: chat.chat,
                        message: message
                    });

                    session.sendMessage(updatedMessage);

                    const updatedTaskList = await this.taskListUpdateService.update(message, chat.chat);

                    session.sendTaskList(updatedTaskList);
                };

                session.sendDone();
            }
        );
    }

    private parseWSMessage(message: Buffer): WSMessage {

        const rawMessage = JSON.parse(message.toString());

        const validatedMessage = WSMessageSchema.safeParse(rawMessage);

        if (!validatedMessage.success)
            throw new Error(validatedMessage.error.message);

        return validatedMessage.data;
    }
}