import type { TaskList } from "@thesis/types";
import type { Scenario } from "@thesis/types";
import type { WithStatus } from "@thesis/types";
import { saveTaskList } from "../../repository/chat/task-list-repository.js";
import { STATIC_TASK_LISTS } from "../../data/static-data.js";

type GenerateTaskListInput = {
    uid: string;
    chatId: string;
    scenario: Scenario;
};

export class TaskListGenerationService {

    public async generate({
        uid,
        chatId,
        scenario
    }: GenerateTaskListInput): Promise<WithStatus<"taskList", TaskList>> {

        const taskList = STATIC_TASK_LISTS[scenario.id!];

        if (!taskList)
            throw new Error(`No static task list found for scenario id "${scenario.id}"`);

        return saveTaskList(uid, chatId, taskList);
    };
};
