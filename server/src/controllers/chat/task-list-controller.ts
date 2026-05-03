import type { AuthRequest } from "../../middlewares/auth-handler.js";
import type { TaskListGenerationService } from "../../services/chat/task-list-generation-service.js";
import type { Response } from "express";

export class TaskListController {

    constructor(private taskListService: TaskListGenerationService) {};

    async handleGenerateTaskList(req: AuthRequest, res: Response) {

        const {uid} = req.authToken;

        const {
            chatId,
            scenario
        } = req.body;

        const {status, taskList} = await this.taskListService.generate({
            uid,
            chatId, 
            scenario
        });

        return res.status(status).json({taskList});
    }
}