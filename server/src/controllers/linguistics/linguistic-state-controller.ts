import type { AuthRequest } from "../../middlewares/auth-handler.js";
import type { LinguisticStateService } from "../../services/linguistics/linguistic-state-service.js";
import type { Response } from "express";
import { log } from "../../services/logger/activity-logger-service.js";

export class LinguisticStateController {

    constructor(public linguisticStateService: LinguisticStateService) {}

    async handleUpdateState(req: AuthRequest, res: Response) {

        const {uid} = req.authToken;
        const {chatId} = req.body;

        const {status, store} = await this.linguisticStateService.update({
            uid, chatId
        });

        log({
            action: "linguistic_state_generated",
            status: "success",
            uid,
            relatedIds: {
                chatId: chatId ?? "",
                storeId: store.id
            }
        })

        return res.status(status).json({store: store});
    }
}