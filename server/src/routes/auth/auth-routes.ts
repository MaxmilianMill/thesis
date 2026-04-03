import { Router, type Request, type Response } from "express";
import { catchAsync } from "../../utils/catch-async.js";
import authController from "../../controllers/auth/auth-controller.js";

const authRouter = Router();

authRouter.post(
    "/create", 
    catchAsync(
        (req: Request, res: Response) => 
            authController.handleCreateUser(req, res)
    ));

export default authRouter;