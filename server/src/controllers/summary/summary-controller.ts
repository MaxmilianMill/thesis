import type { AuthRequest } from "../../middlewares/auth-handler.js";
import type { LinguisticStateService } from "../../services/linguistics/linguistic-state-service.js";
import { log } from "../../services/logger/activity-logger-service.js";
import type { SummaryGenerationService } from "../../services/summary/summary-generator-service.js";
import type { Request, Response } from "express";

export class SummaryController {

    constructor(
        private summaryGenerationService: SummaryGenerationService,
        private linguisticStoreService: LinguisticStateService
    ) {};

    public async handleSummaryGeneration(req: AuthRequest, res: Response) {

        const {uid} = req.authToken;

        const {
            chatId,
            condition,
            history
        } = req.body;

        const {status, summary} = await this.summaryGenerationService.generate({
            uid, chatId, history
        });

        let newFacts: string[] = [];
        // update the linguistic store only on the warm up chat — await so the store
        // is ready before the user navigates into the next chat session
        if (condition === "warmup") {
            const storeResult = await this.linguisticStoreService.update({uid, chatId});
            newFacts = storeResult.newFacts;
        }

        log({
            uid,
            action: "summary_generated",
            status: "success",
            relatedIds: {
                chatId
            }
        });

        return res.status(status).json({ ...summary, newFacts });
    }
};