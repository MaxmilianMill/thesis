import { Router, type Request, type Response } from "express";
import { catchAsync } from "../../utils/catch-async.js";
import { SetupController } from "../../controllers/setup/setup-controller.js";
import { InfoService } from "../../services/setup/info-service.js";

const setupRouter = Router();

const infoService = new InfoService();
const setupController = new SetupController(infoService);

setupRouter.post("/create",
    catchAsync((req: Request, res: Response) => 
        setupController.handleCreateInfo(req, res)
    )
);

setupRouter.post("/update", 
    catchAsync((req: Request, res: Response) => 
        setupController.handleUpdateInfo(req, res)
    )
);

setupRouter.get("/info/:id",
    catchAsync((req: Request, res: Response) => 
        setupController.handleGetInfo(req, res)
    )
);

export default setupRouter;