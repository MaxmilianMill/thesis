import { Modality } from "@google/genai";
import { MODELS } from "../../integrations/ai/config.js";
import type { Chat, LinguisticStore, Message, UserInfo } from "@thesis/types";

export class AISessionService {

    constructor(
        public userInfo: UserInfo,
        public chat: Chat,
        public linguisticStore: LinguisticStore | null,
    ) {}

    sendTextMessage(
        ws: WebSocket,
        chat: Chat,
        message?: Message,
        history?: Message[]
    ) {
        const turnPrompt = this.buildTurnContext(chat, false, history, message);

        console.log(turnPrompt);

        const textMessage = {
            clientContent: {
                turns: [{ role: "user", parts: [{ text: turnPrompt }] }],
                turnComplete: true
            }
        };

        ws.send(JSON.stringify(textMessage));
        console.log("Text message sent: ", textMessage);
    }

    sendAudioMessage(
        ws: WebSocket,
        base64Audio: string,
    ) {
        const audioMessage = {
            realtimeInput: {
                audio: {
                    mimeType: "audio/pcm;rate=16000",
                    data: base64Audio
                }
            }
        };

        ws.send(JSON.stringify(audioMessage));
    }

    sendActivityStart(
        ws: WebSocket,
        chat: Chat,
        history?: Message[]
    ) {
        const turnPrompt = this.buildTurnContext(chat, true, history);

        ws.send(JSON.stringify({
            clientContent: {
                turns: [{ role: "user", parts: [{ text: turnPrompt }] }],
                turnComplete: true
            }
        }));

        ws.send(JSON.stringify({
            realtimeInput: { activityStart: {} }
        }));
    }

    sendActivityEnd(ws: WebSocket) {
        ws.send(JSON.stringify({
            realtimeInput: { activityEnd: {} }
        }));
    }

    buildSystemInstruction() {
        const systemPrompt = this.buildSystemPrompt();

        const configMessage = {
            setup: {
                model: `models/${MODELS.LIVE}`,
                systemInstruction: {
                    parts: [{ text: systemPrompt }]
                },
                generationConfig: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: {
                        voiceConfig: { prebuiltVoiceConfig: { 
                            voiceName: this.userInfo.partner?.voiceConfig.voiceName ?? "Aoede" } }
                    },
                },
                realtimeInputConfig: {
                    automaticActivityDetection: { disabled: true }
                },
                output_audio_transcription: {},
                input_audio_transcription: {}
            }
        }

        return JSON.stringify(configMessage);
    }

    private buildSystemPrompt(): string {
        return this.chat.condition === "control"
            ? this.buildGenericSystemPrompt()
            : this.buildPersonalizedSystemPrompt();
    }

    private buildTurnContext(
        chat: Chat,
        isAudio?: boolean,
        history?: Message[],
        message?: Message,
    ): string {
        return this.chat.condition === "control"
            ? this.buildGenericTurnContext(chat, isAudio, history, message)
            : this.buildPersonalizedTurnContext(chat, isAudio, history, message);
    }

    private levelGuidance(levelCode: string): string {
        if (levelCode === "a1" || levelCode === "a2")
            return "- Use simple vocabulary, short sentences, and common everyday expressions. Avoid complex grammar.";
        if (levelCode === "b1" || levelCode === "b2")
            return "- Use natural, moderately complex sentences. Introduce idiomatic expressions where fitting.";
        return "- Use rich, nuanced language. Include colloquialisms, idioms, and complex sentence structures.";
    }

    private buildPersonalizedSystemPrompt(): string {
        const {
            language, level, interests, name, partner,
            mothertongue, spokenLanguages, ageRange, gender,
            fieldOfWork, difficulties, learningGoal, learningTools
        } = this.userInfo;

        const persona = partner?.personalityDescription ?? "a friendly language buddy";

        const summary = this.linguisticStore?.summary?.trim()
            ? this.linguisticStore.summary
            : "No prior data — adapt as you observe.";

        const factsBlock = this.linguisticStore?.facts?.length
            ? this.linguisticStore.facts.map(f => `- ${f}`).join("\n")
            : "- (none yet)";

        return `You are ${persona}.
            You are a natural conversation partner — a friend who happens to be a fluent speaker of ${language.name}, not a teacher.

            ## About the Learner
            - Name: ${name ?? "the user"}
            ${mothertongue ? `- Mother tongue: ${mothertongue.name}` : ""}
            ${spokenLanguages?.length ? `- Other languages spoken: ${spokenLanguages.join(", ")}` : ""}
            ${ageRange ? `- Age range: ${ageRange}` : ""}
            ${gender ? `- Gender: ${gender}` : ""}
            ${fieldOfWork ? `- Field of work: ${fieldOfWork}` : ""}
            ${interests?.length ? `- Interests: ${interests.join(", ")}` : ""}

            ## Learning Profile
            - Target language: ${language.name} (${language.code.toUpperCase()})
            - CEFR level: ${level.code.toUpperCase()} — ${level.name}
            ${difficulties?.length ? `- Self-reported difficulties: ${difficulties.join(", ")}` : ""}
            ${learningGoal ? `- Learning goal: ${learningGoal}` : ""}
            ${learningTools?.length ? `- Preferred learning tools: ${learningTools.join(", ")}` : ""}

            ## Linguistic State (from prior sessions)
            ${summary}

            Specific patterns to keep in mind:
            ${factsBlock}

            ## Adaptation Strategy
            - Use the linguistic state to choose vocabulary and grammar that expose the learner to their weak points in natural context. Never lecture or label.
            - For areas the learner is strong in, push slightly above their comfort zone. For flagged weak areas, stay at-level and model correct usage in your reply.
            - Reuse their interests, profession, and life context to make examples concrete and personally relevant — woven in, never as a checklist.

            ## Conversation Rules
            1. **Always respond in ${language.name}.** Never switch languages, even if the user writes in another language.
            2. **Match the CEFR level (${level.code.toUpperCase()}):**
            ${this.levelGuidance(level.code)}
            3. **Stay in character.** Do not explain grammar unless the user asks.
            4. **Guide, don't give away.** Steer the conversation so the learner has a natural opportunity to attempt the current task. Never complete it for them.
            5. **Be concise.** 1–3 sentences unless the moment genuinely calls for more.
            6. **Never mention tasks, lists, learning goals, the linguistic profile, or that you are an AI / language tutor.** This must feel like a real chat.
            7. **Your reply will be spoken aloud — write naturally. No markdown, no bullet points, no emoji, no stage directions.**`;
    }

    private buildGenericSystemPrompt(): string {
        const { language, partner } = this.userInfo;
        const persona = partner?.personalityDescription ?? "a friendly language buddy";

        return `You are ${persona}.
            You are a natural conversation partner — a friend who happens to be a fluent speaker of ${language.name}, not a teacher.

            ## Conversation Rules
            1. **Always respond in ${language.name}.** Never switch languages, even if the user writes in another language.
            2. **Stay in character.** Do not explain grammar unless the user asks.
            3. **Guide, don't give away.** Steer the conversation so the user has a natural opportunity to attempt the current task. Never complete it for them.
            4. **Be concise.** 1–3 sentences unless the moment genuinely calls for more.
            5. **Never mention tasks, lists, learning goals, or that you are an AI / language tutor.** This must feel like a real chat.
            6. **Your reply will be spoken aloud — write naturally. No markdown, no bullet points, no emoji, no stage directions.**`;
    }

    private buildTaskBlocks(chat: Chat) {
        const { taskList } = chat;
        const currentTask = taskList.find(t => !t.completed) ?? null;
        const completedTasks = taskList.filter(t => t.completed);
        const remainingTasks = taskList.filter(t => !t.completed);

        const progressSummary = `${completedTasks.length} of ${taskList.length} tasks completed.`;

        const currentTaskBlock = currentTask
            ? `Task ${currentTask.id}: "${currentTask.description}"
            ${currentTask.hint.used ? "(The user has already used a hint for this task.)" : ""}
            ${currentTask.solution.used ? "(The user has already seen the solution for this task.)" : ""}`
            : `All tasks are completed. The conversation is wrapping up.`;

        const upcomingTasksBlock = remainingTasks.length > 1
            ? remainingTasks.slice(1).map(t => `- Task ${t.id}: "${t.description}"`).join("\n")
            : "";

        return { progressSummary, currentTaskBlock, upcomingTasksBlock };
    }

    private formatUserMessage(isAudio?: boolean, message?: Message): string {
        if (isAudio) return "(Attached as an audio file.)";
        if (message) return `"${message.text}"`;
        return "(You introduce the conversation now.)";
    }

    private buildPersonalizedTurnContext(
        chat: Chat,
        isAudio?: boolean,
        history?: Message[],
        message?: Message,
    ): string {
        const { progressSummary, currentTaskBlock, upcomingTasksBlock } = this.buildTaskBlocks(chat);

        const mistakes = history
            ?.filter(m => m.isUser && m.mistakes && m.mistakes.length > 0)
            .flatMap(m => m.mistakes!)
            .map(mk => `- [${mk.type}] ${mk.explanation}`)
            .join("\n");

        const conversationHistory = history?.map((msg) => {
            return { role: msg.isUser ? "user" : "assistant", text: msg.text}
        }).toString();

        const recentMistakesBlock = mistakes
            ? `## Recent Mistakes in This Conversation
                ${mistakes}
                (Watch for these patterns; gently model the correct form in your reply.)`
            : "";

        const factsBlock = this.linguisticStore?.facts?.length
            ? `## Linguistic Patterns to Watch (from prior sessions)
                ${this.linguisticStore.facts.map(f => `- ${f}`).join("\n")}
                (If the user produces these correctly, reinforce naturally. If not, model the correct form — never label the mistake.)`
            : "";

        const scenarioBlock = chat.scenario?.aiDescription
            ? `## Scenario
                ${chat.scenario.aiDescription}`
            : "";

        return `${scenarioBlock}

            ## Progress
            ${progressSummary}

            ## Current Task — steer toward this, do NOT reveal it
            ${currentTaskBlock}

            ${upcomingTasksBlock ? `## Upcoming Tasks — be aware, do NOT address yet\n${upcomingTasksBlock}` : ""}

            ${recentMistakesBlock}

            ${factsBlock}

            ## Conversation history
            ${conversationHistory}

            ## Current User Message
            ${this.formatUserMessage(isAudio, message)}

            Respond now as the conversation partner. Speak naturally — your reply will be spoken aloud, so no markdown and no bullet points.`;
    }

    private buildGenericTurnContext(
        chat: Chat,
        isAudio?: boolean,
        history?: Message[],
        message?: Message,
    ): string {
        const { progressSummary, currentTaskBlock, upcomingTasksBlock } = this.buildTaskBlocks(chat);

        const conversationHistory = history?.map((msg) => {
            return { role: msg.isUser ? "user" : "assistant", text: msg.text}
        }).toString();

        const scenarioBlock = chat.scenario?.aiDescription
            ? `## Scenario
            ${chat.scenario.aiDescription}`
                        : "";

                    return `${scenarioBlock}

            ## Progress
            ${progressSummary}

            ## Current Task — steer toward this, do NOT reveal it
            ${currentTaskBlock}

            ${upcomingTasksBlock ? `## Upcoming Tasks — be aware, do NOT address yet\n${upcomingTasksBlock}` : ""}

            ## Conversation history
            ${conversationHistory}

            ## Current User Message
            ${this.formatUserMessage(isAudio, message)}

            Respond now. Speak naturally — your reply will be spoken aloud, so no markdown and no bullet points.`;
    }
}
