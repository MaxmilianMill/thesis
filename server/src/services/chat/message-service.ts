import type { GenerateContentConfig } from "@google/genai";
import type { Message } from "../../types/chat/message.js";
import { generateMessageStream } from "../../repository/chat/message-repository.js";
import { getInfoData } from "../../repository/setup/info-repository.js";
import { getChat } from "../../repository/chat/chat-repository.js";

export class MessageService {

    public async answerStream(
        uid: string,
        chatId: string,
        onTextChunk: (textChunk: string) => void,
        message?: Message,
        history?: Message[],
    ) {

        let prompt: string; 

        if (!message) {
            prompt = await this.buildOpenerPrompt(uid, chatId);
        } else {
            prompt = await this.buildPrompt(
                uid, chatId, message, history
            );
        };

        const config = this.getConfig();

        const stream = generateMessageStream(
            prompt,
            config
        );

        for await (const textChunk of stream) {
            onTextChunk(textChunk);
        };
    };

    private async buildPrompt(
        uid: string,
        chatId: string,
        message: Message, 
        history?: Message[]
    ): Promise<string> {

        const [
            userInfo,
            chat
        ] = await Promise.all([
            getInfoData(uid),
            getChat(uid, chatId)
        ]);

        const { language, level, interests, name, partner } = userInfo.userInfo;
        const { taskList } = chat.chat!;

        const currentTask = taskList.find(t => !t.completed) ?? null;
        const completedTasks = taskList.filter(t => t.completed);
        const remainingTasks = taskList.filter(t => !t.completed);

        const interestsList = interests.length > 0
            ? interests.join(", ")
            : "general topics";

        const progressSummary = `${completedTasks.length} of ${taskList.length} tasks completed`;

        const currentTaskBlock = currentTask
            ? `The user is currently working on this task:
                - Task ${currentTask.id}: "${currentTask.description}"
                ${currentTask.usedHint ? "(The user has already used a hint for this task.)" : ""}
                ${currentTask.usedSolution ? "(The user has already seen the solution for this task.)" : ""}`
                    : `All tasks are completed. The conversation is wrapping up.`;

                const upcomingTasksBlock = remainingTasks.length > 1
                    ? `Upcoming tasks (do NOT address these yet, just be aware of them):
        ${remainingTasks.slice(1).map(t => `- Task ${t.id}: "${t.description}"`).join("\n")}`
                    : "";

                const mistakesBlock = history
                    ?.filter(m => m.isUser && m.mistakes && m.mistakes.length > 0)
                    .flatMap(m => m.mistakes!)
                    .map(mistake => `- [${mistake.type}] ${mistake.explanation}`)
                    .join("\n");

        const recentMistakesSection = mistakesBlock
            ? `The user has made the following language mistakes during this conversation. Keep them in mind and gently weave in corrections or reinforcement where natural:
        ${mistakesBlock}`
            : "";

        return `You are ${partner?.personalityDescription ?? "a friendly language buddy"}.
            Your role is to have a natural, engaging conversation with the user to help them practice ${language.name}.

            ## User Profile
            - Name: ${name ?? "the user"}
            - Practicing: ${language.name} (${language.code.toUpperCase()})
            - Level: ${level.name} (${level.code.toUpperCase()})
            - Interests: ${interestsList}

            ## Conversation Scenario & Progress
            ${progressSummary}

            ${currentTaskBlock}

            ${upcomingTasksBlock}

            ${recentMistakesSection}

            ## Your Behavior Rules
            1. **Always respond in ${language.name}.** Never switch to any other language, even if the user writes in their native language.
            2. **Match the user's level.** For ${level.name} (${level.code.toUpperCase()}):
            ${level.code === "a1" || level.code === "a2"
                ? "- Use simple vocabulary, short sentences, and common everyday expressions. Avoid complex grammar."
                : level.code === "b1" || level.code === "b2"
                ? "- Use natural, moderately complex sentences. Introduce idiomatic expressions where fitting."
                : "- Use rich, nuanced language. Include colloquialisms, idioms, and complex sentence structures."
            }
            3. **Stay in character** as a natural conversation partner — not a teacher. Do not explicitly explain grammar unless the user asks.
            4. **Guide, don't give away.** Steer the conversation so the user naturally has the opportunity to complete the current task. Do not complete the task for them or tell them what to say. If they used a hint or solution, you may be slightly more direct in your guidance.
            5. **Be engaging and personal.** Reference the user's interests (${interestsList}) naturally to make the conversation feel relevant and fun.
            6. **Keep responses concise.** Aim for 1–3 sentences unless the scenario calls for more. Avoid monologues.
            7. **Never mention tasks, task lists, or learning objectives directly.** The conversation must feel like a real-life interaction, not a language exercise.

            ## Current User Message
            "${message.text}"

            Now respond as the language buddy. Your response will be spoken aloud, so write naturally — no bullet points, no markdown formatting.`;
    };

    private async buildOpenerPrompt(
        uid: string,
        chatId: string
    ): Promise<string> {

        const [
            userInfo,
            chat
        ] = await Promise.all([
            getInfoData(uid),
            getChat(uid, chatId)
        ]);

        const { language, level, interests, name, partner } = userInfo.userInfo;
        const { taskList } = chat.chat!;

        // For the opener, we only care about setting up the very first task.
        const firstTask = taskList[0];
        const upcomingTasks = taskList.slice(1);

        const interestsList = interests.length > 0
            ? interests.join(", ")
            : "general topics";

        const upcomingTasksBlock = upcomingTasks.length > 0
            ? `Upcoming tasks for later in the conversation (do NOT address these yet):
                ${upcomingTasks.map(t => `- Task ${t.id}: "${t.description}"`).join("\n")}`
            : "";

        return `You are ${partner?.personalityDescription ?? "a friendly language buddy"}.
            Your role is to INITIATE a natural, engaging conversation with the user to help them practice ${language.name}.

            ## User Profile
            - Name: ${name ?? "the user"}
            - Practicing: ${language.name} (${language.code.toUpperCase()})
            - Level: ${level.name} (${level.code.toUpperCase()})
            - Interests: ${interestsList}

            ## Your Opening Goal
            The user needs to accomplish the following task:
            - "${firstTask?.description}"

            ${upcomingTasksBlock}

            ## Your Behavior Rules
            1. **Always respond in ${language.name}.** 2. **Match the user's level.** For ${level.name} (${level.code.toUpperCase()}):
            ${level.code === "a1" || level.code === "a2"
                ? "- Use simple vocabulary, short sentences, and common everyday expressions. Avoid complex grammar."
                : level.code === "b1" || level.code === "b2"
                ? "- Use natural, moderately complex sentences. Introduce idiomatic expressions where fitting."
                : "- Use rich, nuanced language. Include colloquialisms, idioms, and complex sentence structures."
            }
            3. **Set the scene naturally.** Start the roleplay or conversation immediately. Do not say "Hello, let's start." Just jump right into character.
            4. **Provide a hook.** End your opening message with a natural question or statement that prompts the user to respond and begin working towards their first task.
            5. **Be engaging and personal.** You may reference the user's interests (${interestsList}) to break the ice if it fits the scenario naturally.
            6. **Keep it concise.** Aim for 1–3 sentences. Give the user room to speak.
            7. **Never mention tasks, task lists, or learning objectives directly.** The conversation must feel like a real-life interaction.

            Now, generate the opening message to start the conversation. Your response will be spoken aloud, so write naturally — no bullet points, no markdown formatting.`;
    };

    private getConfig(): GenerateContentConfig {
        return {
            temperature: 0.7
        }
    };
};