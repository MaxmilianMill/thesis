import type { AuthRequest } from "../../middlewares/auth-handler.js";
import type { TutorService } from "../../services/chat/tutor-service.js";
import type { Response } from "express";

export class TutorController {

    constructor(
        public tutorService: TutorService
    ) {};

    async handleGenerateTutorResponse(req: AuthRequest, res: Response) {
        
        const {uid} = req.authToken;

        const {
            userInfo,
            question,
            history
        } = req.body;

        const answer = await this.tutorService.generate({
            userInfo,
            question,
            history
        });

        return res.status(200).json({answer});
    }
}