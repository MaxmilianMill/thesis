import type { AuthRequest } from "../../middlewares/auth-handler.js";
import type { LinguisticStateService } from "../../services/linguistics/linguistic-state-service.js";
import type { Response } from "express";

export class LinguisticStateController {

    constructor(public linguisticStateService: LinguisticStateService) {}

    async handleUpdateState(req: AuthRequest, res: Response) {

        const {uid} = req.authToken;
        const {chatId} = req.body;

        const {status, data} = await this.linguisticStateService.update({
            uid, chatId
        });

        return res.status(status).json({store: data});
    }
}