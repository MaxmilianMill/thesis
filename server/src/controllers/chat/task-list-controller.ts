import type { AuthRequest } from "../../middlewares/auth-handler.js";
import type { TaskListGenerationService } from "../../services/chat/task-list-generation-service.js";
import type { Response } from "express";
import { log } from "../../services/logger/activity-logger-service.js";

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

        log({
            action: "task_list_generated",
            status: "success",
            uid,
            relatedIds: {
                chatId
            }
        })

        return res.status(status).json({taskList});
    }
}