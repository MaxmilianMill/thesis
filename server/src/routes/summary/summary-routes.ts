import { Router, type Request, type Response } from "express";
import { catchAsync } from "../../utils/catch-async.js";
import { SummaryGenerationService } from "../../services/summary/summary-generator-service.js";
import { SummaryController } from "../../controllers/summary/summary-controller.js";

const summaryRouter = Router();

const summaryGenerationService = new SummaryGenerationService();
const summaryController = new SummaryController(summaryGenerationService);

summaryRouter.post("/generate", 
    catchAsync((req: Request, res: Response) => 
        summaryController.handleSummaryGeneration(req, res)
    )
);

export default summaryRouter;