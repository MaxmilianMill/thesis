import { Router, type Request, type Response } from "express";
import { catchAsync } from "../../utils/catch-async.js";
import { SetupController } from "../../controllers/setup/setup-controller.js";
import { InfoService } from "../../services/setup/info-service.js";
import { ScenarioService } from "../../services/setup/scenario-service.js";

const setupRouter = Router();

const infoService = new InfoService();
const scenarioService = new ScenarioService();
const setupController = new SetupController(
    infoService,
    scenarioService
);

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

setupRouter.post("/scenario",
    catchAsync((req: Request, res: Response) => 
        setupController.handleGetScenario(req, res)
    )
);

export default setupRouter;