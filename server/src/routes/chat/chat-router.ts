import { Router, type Request, type Response } from "express";
import { catchAsync } from "../../utils/catch-async.js";
import { ChatService } from "../../services/chat/chat-service.js";
import { ChatController } from "../../controllers/chat/chat-controller.js";

const chatRouter = Router();

const chatService = new ChatService();
const chatController = new ChatController(chatService);

chatRouter.post("/update", 
    catchAsync(
        (req: Request, res: Response) => 
            chatController.handleUpdateChat(req, res)
    )
);

chatRouter.post("/create",
    catchAsync(
        (req: Request, res: Response) => 
            chatController.handleAddChat(req, res)
    )
);

export default chatRouter;