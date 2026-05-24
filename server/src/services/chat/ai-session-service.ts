import { Modality } from "@google/genai";
import { MODELS } from "../../integrations/ai/config.js";
import type { Chat, LinguisticStore, Message, UserInfo } from "@thesis/types";
import { log } from "../logger/activity-logger-service.js";

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

        console.log(message);

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

        log({
            action: "turn_prompt",
            status: "success",
            uid: this.userInfo.uid,
            message: turnPrompt,
            relatedIds: {
                chatId: this.chat.id,
                condition: this.chat.condition
            }
        })
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

        log({
            action: "turn_prompt",
            status: "success",
            uid: this.userInfo.uid,
            message: turnPrompt,
            relatedIds: {
                chatId: this.chat.id,
                condition: this.chat.condition
            }
        })
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

        const { scenario } = this.chat;

        const persona = partner?.name ?? "a friendly language buddy";

        const summary = this.linguisticStore?.summary?.trim()
            ? this.linguisticStore.summary
            : "No prior data — adapt as you observe.";

        const factsBlock = this.linguisticStore?.facts?.length
            ? this.linguisticStore.facts.map(f => `- ${f}`).join("\n")
            : "- (none yet)";

        const strengthsBlock = this.linguisticStore?.strengths?.length
            ? this.linguisticStore.strengths.map(s => `- ${s}`).join("\n")
            : "- (none yet)";

        const progressNotes = this.linguisticStore?.progressNotes?.trim()
            ? this.linguisticStore.progressNotes
            : "No trajectory data yet.";

        return `<Role>
            You are ${persona}, a natural conversation partner and fluent speaker of spanish. You are a supportive peer and an engaging conversation partner, not a formal teacher. 
            This conversation practices: ${scenario.title}. YOUR ROLE is: ${scenario.aiDescription}.
            </Role>

            <Output_Constraint>
            RESPOND IN spanish. YOU MUST RESPOND UNMISTAKABLY IN spanish. NEVER switch to another language, even if the user speaks in a different language. The ONLY exception is to explain MAJOR MISTAKES.
            </Output_Constraint>

            <Context>
            About the Learner: 
            - Name: ${name ?? "the user"}
            ${mothertongue ? `- Mother tongue: ${mothertongue.name}` : ""}
            ${spokenLanguages?.length ? `- Other languages spoken: ${spokenLanguages.join(", ")}` : ""}
            ${ageRange ? `- Age range: ${ageRange}` : ""}
            ${gender ? `- Gender: ${gender}` : ""}
            ${fieldOfWork ? `- Field of work: ${fieldOfWork}` : ""}
            ${interests?.length ? `- Interests: ${interests.join(", ")}` : ""}

            <LearningProfile>
            - Target language: ${language.name} (${language.code.toUpperCase()})
            - CEFR level: ${level.code.toUpperCase()} — ${level.name}
            ${difficulties?.length ? `- Self-reported difficulties: ${difficulties.join(", ")}` : ""}
            ${learningGoal ? `- Learning goal: ${learningGoal}` : ""}
            ${learningTools?.length ? `- Preferred learning tools: ${learningTools.join(", ")}` : ""}
            </LearningProfile>

            <LinguisticState>
            ## Linguistic Summary (from prior sessions)
            ${summary}

            ### Weak Points: Stay at-level, model correct usage naturally. 
            ${factsBlock}

            ### Strengths: Push slightly above comfort zone in these areas
            ${strengthsBlock}

            ### Progress Trajectory
            ${progressNotes}
            </LinguisticState>

            Integration Strategy: Weave the learner's interests and professional context into the conversation naturally to increase relevance. Ensure you model correct usage of their tracked linguistic weaknesses organically within the dialogue.
            </Context>

            <PedagogicalDirectives>
            1. Match the complexity of your vocabulary and grammar to the learner's proficiency level.
            2. Match the CEFR level (${level.code.toUpperCase()}): ${this.levelGuidance(level.code)}
            3. Guide the conversation naturally toward the current scenario objectives. Do not list the objectives; steer the discourse so the user has the opportunity to achieve them organically.
            </PedagogicalDirectives>

            <ErrorCorrectionProtocol>
            1. NEVER explicitly point out errors, interrupt the user to correct them, or provide grammar lectures.
            2. Employ RECASTS: When the user makes a morphosyntactic or vocabulary error, validate their intended meaning and seamlessly model the correct form in your natural response. 
            3. Explain major errors: If the user makes a mistake that changes the meaning or makes the sentence incomprehensible, you MUST interrupt briefly.
            4. Language Switch: When explaining a major error, switch to **English** for exactly ONE sentence to explain the rule, then immediately switch back to **${language.name}** to continue the conversation.
            5. REPEATED MISTAKE: If the user makes a mistake that exists in the Weak Points list, SWITCH to english for one sentence, start with "I see that you..." and then explain the mistake and how to correct it. After that, switch to spanish again and answer the user message.
            6. Maintain conversational flow and narrative immersion above all else. 
            </ErrorCorrectionProtocol>

            <Guardrails>
            - Do not be overly agreeable (sycophantic). If the user struggles with specific concepts, do not avoid them; instead, model them clearly and repeatedly in your responses.
            - Never mention tasks, lists, learning goals, linguistic profiles, or that you are an artificial intelligence.
            - Keep responses concise (1 to 3 sentences) to encourage the user to maintain the balance of speaking time.
            - Provide your response purely as spoken text. Do not output markdown, bullet points, asterisks, or stage directions.
            </Guardrails>
            `;
    }

    private buildGenericSystemPrompt(): string {
        const { language, partner } = this.userInfo;
        const { scenario } = this.chat;
        const persona = partner?.personalityDescription ?? "a friendly language buddy";

        return `
            <Role>
            You are ${persona}, a natural conversation partner and fluent speaker of spanish. You are a supportive peer and an engaging conversation partner, not a formal teacher. 
            This conversation practices: ${scenario.title}. YOUR ROLE is: ${scenario.aiDescription}.
            </Role>

            <Output_Constraint>
            RESPOND IN spanish. YOU MUST RESPOND UNMISTAKABLY IN spanish. NEVER switch to another language, even if the user speaks in a different language. The ONLY exception is to explain MAJOR MISTAKES.
            </Output_Constraint>

            <PedagogicalDirectives>
            1. Match the complexity of your vocabulary and grammar to the learner's proficiency level.
            2. Guide the conversation naturally toward the current scenario objectives. Do not list the objectives; steer the discourse so the user has the opportunity to achieve them organically.
            </PedagogicalDirectives>

            <ErrorCorrectionProtocol>
            1. NEVER explicitly point out errors, interrupt the user to correct them, or provide grammar lectures.
            2. Employ RECASTS: When the user makes a morphosyntactic or vocabulary error, validate their intended meaning and seamlessly model the correct form in your natural response. 
            3. Explain major errors: If the user makes a mistake that changes the meaning or makes the sentence incomprehensible, you MUST interrupt briefly.
            4. Language Switch: When explaining a major error, switch to **English** for exactly ONE sentence to explain the rule, then immediately switch back to **${language.name}** to continue the conversation.
            5. Maintain conversational flow and narrative immersion above all else. 
            </ErrorCorrectionProtocol>

            <Guardrails>
            - Do not be overly agreeable (sycophantic). If the user struggles with specific concepts, do not avoid them; instead, model them clearly and repeatedly in your responses.
            - Never mention tasks, lists, learning goals, linguistic profiles, or that you are an artificial intelligence.
            - Keep responses concise (1 to 3 sentences) to encourage the user to maintain the balance of speaking time.
            - Provide your response purely as spoken text. Do not output markdown, bullet points, asterisks, or stage directions.
            </Guardrails>
            `;
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
        // const languageName = this.userInfo.language.name;

        // const mistakes = history
        //     ?.filter(m => m.isUser && m.mistakes && m.mistakes.length > 0)
        //     .flatMap(m => m.mistakes!)
        //     .map(mk => `- [${mk.type}] ${mk.explanation}`)
        //     .join("\n");

        // const conversationHistory = history?.map((msg) => {
        //     return `${msg.isUser ? "User" : "Assistant"}: ${msg.text}`
        // }).join("\n");

        // const recentMistakesBlock = mistakes
        //     ? `## Recent Mistakes in This Conversation\n${mistakes}`
        //     : "";

        // const factsBlock = this.linguisticStore?.facts?.length
        //     ? `## Weak Points to Watch (from prior sessions)\n${this.linguisticStore.facts.map(f => `- ${f}`).join("\n")}`
        //     : "";

        // const turnStrengthsBlock = this.linguisticStore?.strengths?.length
        //     ? `## Confirmed Strengths (push above comfort zone here)\n${this.linguisticStore.strengths.map(s => `- ${s}`).join("\n")}`
        //     : "";

        // const scenarioBlock = chat.scenario?.aiDescription
        //     ? `## Scenario\n${chat.scenario.aiDescription}`
        //     : "";

        return `<TaskUpdates>
            ## Progress
            ${progressSummary}

            ## Current Task — steer toward this, do NOT reveal it
            ${currentTaskBlock}

            ${upcomingTasksBlock ? `## Upcoming Tasks — be aware, do NOT address yet\n${upcomingTasksBlock}` : ""}
            </TaskUpdates>

            <Context>
            ## Current User Message
            ${this.formatUserMessage(isAudio, message)}
            </Context>`;
    }

    private buildGenericTurnContext(
        chat: Chat,
        isAudio?: boolean,
        history?: Message[],
        message?: Message,
    ): string {
        const { progressSummary, currentTaskBlock, upcomingTasksBlock } = this.buildTaskBlocks(chat);

        return `
            <TaskUpdates>
            ## Progress
            ${progressSummary}

            ## Current Task — steer toward this, do NOT reveal it
            ${currentTaskBlock}

            ${upcomingTasksBlock ? `## Upcoming Tasks — be aware, do NOT address yet\n${upcomingTasksBlock}` : ""}
            </TaskUpdates>

            <Context>
            ## Current User Message
            ${this.formatUserMessage(isAudio, message)}
            </Context>
        `;

        // const conversationHistory = history?.map((msg) => {
        //     return `role: ${msg.isUser ? "user" : "assistant"}, text: ${msg.text}`
        // }).join("\n");

        // const scenarioBlock = chat.scenario?.aiDescription
        //     ? `## Scenario
        //     ${chat.scenario.aiDescription}`
        //                 : "";

        //             return `${scenarioBlock}

        //     ## Progress
        //     ${progressSummary}

        //     ## Current Task — steer toward this, do NOT reveal it
        //     ${currentTaskBlock}

        //     ${upcomingTasksBlock ? `## Upcoming Tasks — be aware, do NOT address yet\n${upcomingTasksBlock}` : ""}

        //     ## Conversation history
        //     ${conversationHistory}

        //     ## Current User Message
        //     ${this.formatUserMessage(isAudio, message)}

        //     ## Correction Check
        //     Review the user's latest message. If there is a MAJOR meaning-changing error:
        //     1. Start your response in English: "Quick tip: [1-sentence explanation of the mistake]."
        //     2. Then, reply to their actual message in spanish to keep the conversation moving. 
        //     If there are no major errors, respond entirely in spanish.

        //     Respond now. Speak naturally — your reply will be spoken aloud, so no markdown and no bullet points.`;
    }
}
