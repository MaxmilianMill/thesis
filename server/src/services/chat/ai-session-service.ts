import { Modality } from "@google/genai";
import { MODELS } from "../../integrations/ai/config.js";
import type { UserInfo } from "@thesis/types";
import type { Chat } from "@thesis/types";
import type { Message } from "@thesis/types";

export class AISessionService {

    constructor(public userInfo: UserInfo) {
        this.userInfo = userInfo;
    };

    sendTextMessage(
        ws: WebSocket,
        chat: Chat,
        message?: Message,
        history?: Message[]
    ) {
        const turnPrompt = this.buildTurnContext(
            chat, false, history, message
        );

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
                mediaChunks: [{
                    mimeType: "audio/pcm;rate=16000",
                    data: base64Audio
                }]
            },
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
                        voiceConfig: { prebuiltVoiceConfig: { voiceName: "Aoede" } }
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

    private buildSystemPrompt() {
        const { language, level, interests, name, partner } = this.userInfo;

        const interestsList = interests.toString();

        return `
            You are ${partner?.personalityDescription ?? "a friendly language buddy"}.
            Your role is to have a natural, engaging conversation with the user to help them practice ${language.name}.

            ## User Profile
            - Name: ${name ?? "the user"}
            - Practicing: ${language.name} (${language.code.toUpperCase()})
            - Level: ${level.name} (${level.code.toUpperCase()})
            - Interests: ${interestsList}

            ## Your Behavior Rules
            1. **Always respond in ${language.name}** Never switch to any other language, even if the user writes in their native language.
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
        `;
    };

    private buildTurnContext(
        chat: Chat,
        isAudio?: boolean,
        history?: Message[],
        message?: Message, 
    ): string {
        const { taskList } = chat!;

        console.log(message);

        const currentTask = taskList.find(t => !t.completed) ?? null;
        const completedTasks = taskList.filter(t => t.completed);
        const remainingTasks = taskList.filter(t => !t.completed);

        const progressSummary = `${completedTasks.length} of ${taskList.length} tasks completed`;

        const currentTaskBlock = currentTask
            ? `The user is currently working on this task:
                - Task ${currentTask.id}: "${currentTask.description}"
                ${currentTask.hint.used ? "(The user has already used a hint for this task.)" : ""}
                ${currentTask.solution.used ? "(The user has already seen the solution for this task.)" : ""}`
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

        return `
            ## Conversation Scenario & Progress
            ${progressSummary}

            ${currentTaskBlock}

            ${upcomingTasksBlock}

            ${recentMistakesSection}

            ## Current User Message
            "${isAudio ? "The user message is attached as an audio file." : message ? message.text : "You introduce the conversation now."}"

            Now respond as the language buddy. Your response will be spoken aloud, so write naturally — no bullet points, no markdown formatting.`;
    };
    
}