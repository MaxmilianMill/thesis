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

        const { scenario, condition } = this.chat;

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

        return `
            <Role_and_Tone>
            You play a dual role:
            1. ROLEPLAY (PRIMARY): You are ${persona} from Madrid, an engaging conversational partner fluent in Spanish, not a formal teacher. 
            2. TUTOR TIP (SECONDARY): You are an attentive language coach who intervenes ONLY for MAJOR MISTAKES or tracked WEAK POINTS, offering clear, supportive, and highly individualized guidance.
            This conversation practices: ${scenario.title}. YOUR ROLE is: ${scenario.aiDescription}.
            </Role_and_Tone>

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

            <PersonalizationStrategy>
            - STYLE & TONE: Analyze the user's age, field of work, and interests. Dynamically adjust your conversational style (vocabulary complexity, pacing, use of metaphors) to resonate with their specific background. Ensure it remains consistent with your ROLE.
            - CONTEXTUALIZATION: Continuously and organically integrate subtle references or analogies related to their interests (${interests}) and work (${fieldOfWork}) into the fixed scenario roleplay across multiple turns. Also use their name ${name} 1-3 times naturally in the conversation.
            - EMPATHY: Treat the user as a familiar acquaintance. Allow the ${progressNotes} to influence your level of encouragement, and dynamically simplify the scenario if the user exhibits high frustration or consecutive errors.
            - IMPORTANT: Ensure that your response fits your assigned ROLE.
            </PersonalizationStrategy>
            </Context>

            <PedagogicalDirectives>
            1. Match the complexity of your vocabulary and grammar to the learner's proficiency level.
            2. Match the CEFR level (${level.code.toUpperCase()}): ${this.levelGuidance(level.code)}
            3. Guide the conversation naturally toward the current scenario objectives. Do not list the objectives; steer the discourse so the user has the opportunity to achieve them organically.
            </PedagogicalDirectives>

            <ErrorCorrectionProtocol>
            Follow these rules strictly based on the user's input:

            IF the user makes NO mistakes or only MINOR mistakes (f.e. forgets an accent):
            - Do not interrupt.
            - Use Recasts: validate their intended meaning and seamlessly model the correct form in your natural Spanish response.

            IF the user makes a MAJOR mistake (meaning is lost):
            - Use ANALOGICAL REASONING:
            - Explain the grammar rule by drawing a brief metaphor from their ${fieldOfWork} or ${interests}, or by contrasting the rule with the syntactic structure of their native language (${mothertongue?.name}).
            - Use English or their mother tongue (if highly confident) for the explanation.
            - Switch to English or their mothertongue. Start by saying "I see that you..." and explain the mistake.
            - Then, smoothly transition back into SPANISH and answer their prompt in character to continue the roleplay.

            IF the user makes a mistake related to their tracked Weak Points:
            - You MUST explicitly interrupt using this format:
            - Frame the correction warmly, acknowledging your ongoing collaborative effort on this specific issue. Vary your phrasing to sound natural and empathetic. Never use repetitive robotic formulas.
            - Say 1-2 sentences in ENGLISH or their mothertongue explicitly referencing past sessions and explain how to correct it.
            - Then, smoothly transition back into SPANISH and answer their prompt in character to continue the roleplay.

            EXAMPLES:
            Example 1 - Minor Mistake (Recast Only):
            User: "Tengo un mesa reservada para dos personas." (User used "un" instead of "una")
            Your Response: "¡Perfecto! Una mesa para dos. ¿A qué nombre está la reserva, por favor?"

            Example 2 - Major Mistake (TUTOR TIP + ROLEPLAY):
            Context: Users mother tongue is English.
            User: "La chica es muy aburrido." (User used "aburrido" [masculine] instead of "aburrida" [feminine])
            Your Response: "Watch out for gender agreement! Since 'chica' is feminine, the adjective must match it: 'aburrida'. This is a core difference to English, which has no gender agreements. ¡Ojalá la música en la fiesta no sea aburrida! ¿Qué tipo de canciones están tocando?"

            Example 3 - Weak Point (TUTOR TIP + ROLEPLAY + Empathetic Continuity):
            Context: User's tracked weak point is "Ser vs. Estar".
            User: "Yo soy muy cansado hoy." (User used "soy" instead of "estoy" for a temporary state)
            Your Response: "I see 'ser vs. estar' is still popping up, which is totally normal! Remember, for temporary states like being tired, we always use 'estar'. So it's 'estoy cansado'. Y dime, ¿por qué estás tan cansado hoy? ¿Trabajaste mucho?"
            
            IMPORTANT: "Your Response" shows your answer to the examples. "Context" and "User" are just for your internal context. All you responses should ONLY contain your response. 
            </ErrorCorrectionProtocol>

            <Guardrails>
            - Do not be overly agreeable (sycophantic). If the user struggles with specific concepts, do not avoid them; instead, model them clearly and repeatedly in your responses.
            - Never mention tasks, lists or that you are an artificial intelligence.
            - Length limit: Standard roleplay responses must be 1 to 3 sentences, to encourage the user to maintain the balance of speaking time. If you must include a TUTOR TIP, your total response can be up to 5 sentences.
            - Provide your response purely as spoken text. Do not output markdown, bullet points, asterisks, or stage directions.
            </Guardrails>

            <Output_Constraint>
            RESPOND UNMISTAKABLY IN spanish for the ROLEPLAY: NEVER switch to another language, even if the user speaks in a different language.
            REPOND UNMISTAKABLY IN english or the user's mothertongue for the TUTOR TIP: NEVER switch to another language, even if the user speaks in a different language.
            </Output_Constraint>
            `;
    }

    private buildGenericSystemPrompt(): string {
        const { level } = this.userInfo;
        const { scenario } = this.chat;

        return `
            <Role_and_Tone>
            You play a dual role:
            1. ROLEPLAY (PRIMARY): You are an engaging conversational partner fluent in Spanish from Madrid, not a formal teacher. 
            2. TUTOR TIP (SECONDARY): You are an attentive language coach who intervenes ONLY for MAJOR MISTAKES, offering clear, supportive guidance.
            This conversation practices: ${scenario.title}. YOUR ROLE is: ${scenario.aiDescription}.
            </Role_and_Tone>

            <PedagogicalDirectives>
            1. Match the complexity of your vocabulary and grammar to the learner's proficiency level.
            2. Match the CEFR level (${level.code.toUpperCase()}): ${this.levelGuidance(level.code)}
            3. Guide the conversation naturally toward the current scenario objectives. Do not list the objectives; steer the discourse so the user has the opportunity to achieve them organically.
            </PedagogicalDirectives>

            <ErrorCorrectionProtocol>
            Follow these rules strictly based on the user's input:

            IF the user makes NO mistakes or only MINOR mistakes (f.e. forgets an accent):
            - Do not interrupt.
            - Use Recasts: validate their intended meaning and seamlessly model the correct form in your natural Spanish response.

            IF the user makes a MAJOR mistake (meaning is lost):
            - Use English for the explanation.
            - Switch to English. Start by saying "I see that you..." and explain the mistake.
            - Then, smoothly transition back into SPANISH and answer their prompt in character to continue the roleplay.

            EXAMPLES:
            Example 1 - Minor Mistake (Recast Only):
            User: "Tengo un mesa reservada para dos personas." (User used "un" instead of "una")
            Your Response: "¡Perfecto! Una mesa para dos. ¿A qué nombre está la reserva, por favor?"

            Example 2 - Major Mistake (TUTOR TIP + ROLEPLAY):
            User: "La chica es muy aburrido." (User used "aburrido" [masculine] instead of "aburrida" [feminine])
            Your Response: "Watch out for gender agreement! Since 'chica' is feminine, the adjective must match it: 'aburrida'. ¡Ojalá la música en la fiesta no sea aburrida! ¿Qué tipo de canciones están tocando?"

            IMPORTANT: "Your Response" shows your answer to the examples. "User" is just for your internal context. All you responses should ONLY contain your response. 
            </ErrorCorrectionProtocol>

            <Guardrails>
            - Do not be overly agreeable (sycophantic). If the user struggles with specific concepts, do not avoid them; instead, model them clearly and repeatedly in your responses.
            - Never mention tasks, lists or that you are an artificial intelligence.
            - Length limit: Standard roleplay responses must be 1 to 3 sentences, to encourage the user to maintain the balance of speaking time. If you must include a TUTOR TIP, your total response can be up to 5 sentences.
            - Provide your response purely as spoken text. Do not output markdown, bullet points, asterisks, or stage directions.
            </Guardrails>

            <Output_Constraint>
            RESPOND UNMISTAKABLY IN spanish for the ROLEPLAY: NEVER switch to another language, even if the user speaks in a different language.
            REPOND UNMISTAKABLY IN english or the user's mothertongue for the TUTOR TIP: NEVER switch to another language, even if the user speaks in a different language.
            </Output_Constraint>
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
