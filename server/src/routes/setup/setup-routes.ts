import { Router, type Request, type Response } from "express";
import { catchAsync } from "../../utils/catch-async.js";
import setupController from "../../controllers/setup/setup-controller.js";

const setupRouter = Router();

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

export default setupRouter;