import type { TaskListGenerationService } from "../../services/chat/task-list-service.js";
import type { Request, Response } from "express";

export class TaskListController {

    constructor(private taskListService: TaskListGenerationService) {};

    async handleGenerateTaskList(req: Request, res: Response) {

        const {
            uid,
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