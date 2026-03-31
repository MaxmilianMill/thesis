import { Router } from "express";
import { catchAsync } from "../../utils/catch-async.js";
import authController from "../../controllers/auth/authController.js";
const authRouter = Router();
authRouter.post("/token", catchAsync((req, res) => authController.handleCreateJWT(req, res)));
export default authRouter;
//# sourceMappingURL=authRoutes.js.map