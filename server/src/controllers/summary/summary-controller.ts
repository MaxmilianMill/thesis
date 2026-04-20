import type { AuthRequest } from "../../middlewares/auth-handler.js";
import type { SummaryGenerationService } from "../../services/summary/summary-generator-service.js";
import type { Request, Response } from "express";

export class SummaryController {

    constructor(private summaryGenerationService: SummaryGenerationService) {};

    public async handleSummaryGeneration(req: AuthRequest, res: Response) {

        const {uid} = req.authToken;

        const {
            chatId,
            history
        } = req.body;

        const {status, summary} = await this.summaryGenerationService.generate({
            uid, chatId, history
        });

        return res.status(status).json(summary);
    }
};