import { Router, type Request, type Response } from "express";
import { catchAsync } from "../../utils/catch-async.js";
import authController from "../../controllers/auth/authController.js";

const authRouter = Router();

authRouter.post(
    "/token", 
    catchAsync((req: Request, res: Response) => authController.handleCreateJWT(req, res)));

export default authRouter;