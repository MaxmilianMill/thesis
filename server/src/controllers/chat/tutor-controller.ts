import type { AuthRequest } from "../../middlewares/auth-handler.js";
import type { TutorService } from "../../services/chat/tutor-service.js";
import type { Response } from "express";
import { log } from "../../services/logger/activity-logger-service.js";

export class TutorController {

    constructor(
        public tutorService: TutorService
    ) {};

    async handleGenerateTutorResponse(req: AuthRequest, res: Response) {
        
        const {uid} = req.authToken;

        const {
            userInfo,
            chatId,
            question,
            history
        } = req.body;

        const answer = await this.tutorService.generate({
            userInfo,
            chatId,
            question,
            history
        });

        log({
            action: "tutor_response_generated",
            status: "success",
            uid,
            relatedIds: {
                chatId,
                lastMessageId: answer.lastMessageId
            }
        })

        return res.status(200).json({answer});
    }
}