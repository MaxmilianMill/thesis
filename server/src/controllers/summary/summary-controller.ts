import type { SummaryGenerationService } from "../../services/summary/summary-generator-service.js";
import type { Request, Response } from "express";

export class SummaryController {

    constructor(private summaryGenerationService: SummaryGenerationService) {};

    public async handleSummaryGeneration(req: Request, res: Response) {

        const {
            userInfo, 
            chatId,
            history
        } = req.body;

        const {status, summary} = await this.summaryGenerationService.generate({
            userInfo, chatId, history
        });

        return res.status(status).json(summary);
    }
};