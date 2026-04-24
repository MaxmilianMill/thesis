import { Router, type Response } from "express";
import { authHandler, type AuthRequest } from "../../middlewares/auth-handler.js";
import { catchAsync } from "../../utils/catch-async.js";
import { TutorService } from "../../services/chat/tutor-service.js";
import { TutorController } from "../../controllers/chat/tutor-controller.js";

const tutorRouter = Router();

tutorRouter.use(authHandler);

const tutorService = new TutorService();
const tutorController = new TutorController(tutorService);

tutorRouter.post("/generate", 
    catchAsync((req: AuthRequest, res: Response) => 
        tutorController.handleGenerateTutorResponse(req, res)
    )
)

export default tutorRouter;