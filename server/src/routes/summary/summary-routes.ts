import { Router, type Request, type Response } from "express";
import { catchAsync } from "../../utils/catch-async.js";
import { SummaryGenerationService } from "../../services/summary/summary-generator-service.js";
import { SummaryController } from "../../controllers/summary/summary-controller.js";
import { authHandler, type AuthRequest } from "../../middlewares/auth-handler.js";
import { LinguisticStateService } from "../../services/linguistics/linguistic-state-service.js";

const summaryRouter = Router();

const summaryGenerationService = new SummaryGenerationService();
const linguisticStoreService = new LinguisticStateService();
const summaryController = new SummaryController(
    summaryGenerationService,
    linguisticStoreService
);

summaryRouter.use(authHandler)

summaryRouter.post("/generate", 
    catchAsync((req: AuthRequest, res: Response) => 
        summaryController.handleSummaryGeneration(req, res)
    )
);

export default summaryRouter;