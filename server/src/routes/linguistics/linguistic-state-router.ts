import { Router, type Response } from "express";
import { authHandler, type AuthRequest } from "../../middlewares/auth-handler.js";
import { catchAsync } from "../../utils/catch-async.js";
import { LinguisticStateService } from "../../services/linguistics/linguistic-state-service.js";
import { LinguisticStateController } from "../../controllers/linguistics/linguistic-state-controller.js";

const linguisticStateRouter = Router();

const linguisticStateService = new LinguisticStateService();
const linguisticStateController = new LinguisticStateController(linguisticStateService);

linguisticStateRouter.use(authHandler);

linguisticStateRouter.post("/update", 
    catchAsync((req: AuthRequest, res: Response) => 
        linguisticStateController.handleUpdateState(req, res)
    )
);

export default linguisticStateRouter;