import type { GenerateContentConfig } from "@google/genai";
import type { IAIGenerator } from "../../integrations/ai/ai-generator.js";
import { TaskListSchema, type TaskList } from "../../types/chat/task-list.js";
import { getInfoData } from "../../repository/setup/info-repository.js";
import type { Scenario } from "../../types/setup/scenario.js";
import type { UserInfo } from "../../types/setup/user-info.js";
import z from "zod";
import { saveTaskList, generateTaskList } from "../../repository/chat/task-list-repository.js";
import type { WithStatus } from "../../types/utils/with-status.js";

type GenerateTaskListInput = {
    uid: string;
    chatId: string,
    scenario: Scenario;
};

export class TaskListGenerationService 
    implements IAIGenerator<GenerateTaskListInput, WithStatus<"taskList", TaskList>> {

    public async generate({
        uid,
        chatId,
        scenario
    }: GenerateTaskListInput) {

        const {userInfo} = await getInfoData(uid);

        const prompt = this.buildPrompt(scenario, userInfo);
        const config = this.generateConfig();

        const aiResponse = await generateTaskList(prompt, config);

        const validatedTaskList = this.validate(aiResponse);

        const dbResponse = await saveTaskList(uid, chatId, validatedTaskList);

        return dbResponse;
    };

    private validate(response: string): TaskList {
        const jsonResponse = JSON.parse(response);
        const validatedResponse = TaskListSchema.safeParse(jsonResponse);

        if (!validatedResponse.success)
            throw new Error(validatedResponse.error.message);

        return validatedResponse.data;
    };

    private generateConfig(): GenerateContentConfig {
        return {
            temperature: 0.5,
            thinkingConfig: {
                thinkingBudget: 500,
                includeThoughts: false
            },
            responseMimeType: "application/json",
            responseJsonSchema: z.toJSONSchema(TaskListSchema)
        }
    };

    private buildPrompt(
        scenario: Scenario,
        userInfo: UserInfo
    ) {
        return `
            You are a language learning coach. Create a personalized practice session task list for a learner.

            User info:
            - language: ${userInfo.language.name}
            - level: ${userInfo.level.code} - ${userInfo.level.code}
            - interests: ${userInfo.interests.toString()}
            - partner: ${userInfo.partner?.personalityDescription}

            Scenario:
            ${scenario.userDescription}

            Requirements:
            1. Generate 5 concrete practice tasks.
            2. Use the learner’s language and level.
            3. Make tasks relevant to their interests.
            4. Include at least one speaking task and one writing task.
            5. Keep the session practical and motivating.
            6. Do not invent unrelated topics.
        `
    };
};