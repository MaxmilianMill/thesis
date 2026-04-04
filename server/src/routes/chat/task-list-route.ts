import { Router } from "express";
import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catch-async.js";
import { TaskListController } from "../../controllers/chat/task-list-controller.js";
import { TaskListGenerationService } from "../../services/chat/task-list-service.js";

const taskListRouter = Router();

const taskListService = new TaskListGenerationService();
const taskListController = new TaskListController(taskListService);

taskListRouter.post("/generate", 
    catchAsync((req: Request, res: Response) => 
        taskListController.handleGenerateTaskList(req, res)
    )
)

export default taskListRouter;