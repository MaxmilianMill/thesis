import { Router, type Response } from "express";
import { catchAsync } from "../../utils/catch-async.js";
import { ChatService } from "../../services/chat/chat-service.js";
import { ChatController } from "../../controllers/chat/chat-controller.js";
import { authHandler, type AuthRequest } from "../../middlewares/auth-handler.js";

const chatRouter = Router();

const chatService = new ChatService();
const chatController = new ChatController(chatService);

chatRouter.use(authHandler);

chatRouter.post("/update", 
    catchAsync(
        (req: AuthRequest, res: Response) => 
            chatController.handleUpdateChat(req, res)
    )
);

chatRouter.post("/create",
    catchAsync(
        (req: AuthRequest, res: Response) => 
            chatController.handleAddChat(req, res)
    )
);

export default chatRouter;