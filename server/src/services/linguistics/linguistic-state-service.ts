import type { GenerateContentConfig } from "@google/genai";
import { LinguisticStoreAIGenerationSchema, type LinguisticStore, type Message, type TutorResponse, type UserInfo, type WithStatus } from "@thesis/types";
import { getInfoData } from "../../repository/setup/info-repository.js";
import { generateLinguisticAnalysis, getLinguisticStore, saveOrUpdateLinguisticStore } from "../../repository/linguistics/linguistic-store-repository.js";
import { getChatMessages } from "../../repository/chat/message-repository.js";
import z from "zod";
import { log } from "../logger/activity-logger-service.js";
import { getTutorAnswers } from "../../repository/chat/tutor-repository.js";

interface IUpdateStateInput {
    uid: string;
    chatId?: string;
};

export class LinguisticStateService {

    async update(data: IUpdateStateInput): Promise<WithStatus<"store", LinguisticStore> & { newFacts: string[] }> {

        const {uid, chatId} = data;
        const [
            userInfo,
            chatMessages,
            linguisticStore,
            tutorResponses
        ] = await Promise.all([
            getInfoData(uid),
            // return an empty array if this is the setup generation
            getChatMessages(uid, chatId ?? ""),
            getLinguisticStore(uid),
            getTutorAnswers(uid)
        ]);

        const oldFacts = linguisticStore.store?.facts ?? [];

        const prompt = this.buildPrompt(
            userInfo.userInfo,
            chatMessages.messages ?? [],
            linguisticStore.store,
            tutorResponses.data
        );

        console.log(prompt);

        const config = this.getConfig();

        const response = await generateLinguisticAnalysis(
            prompt, config
        );

        const validatedResponse = this.validate(response);

        if (!validatedResponse)
            throw new Error("Invalid linguistic summary response.");

        const savedStore = await saveOrUpdateLinguisticStore(
            uid, chatId ?? "", validatedResponse
        );

        const newFacts = savedStore.store.facts.filter(f => !oldFacts.includes(f));

        log({
            action: "linguistic_store_updated",
            status: "success",
            uid,
            relatedIds: {
                lastChatId: chatId ?? "setup"
            }
        })

        console.log(savedStore.store);

        return { ...savedStore, newFacts };
    }

    public async get(uid: string): Promise<LinguisticStore | null> {

        const { store } = await getLinguisticStore(uid);

        return store ?? null;
    };

    private buildPrompt(
        userInfo: UserInfo,
        chatHistory?: Message[],
        linguisticStore?: LinguisticStore,
        tutorResponses?: TutorResponse[]
    ) {
        const userMessages = chatHistory?.filter(m => m.isUser);
        const totalMistakes = userMessages?.flatMap(m => m.mistakes ?? []);
        const correctedMessages = userMessages?.filter(m => m.improvedVersion);
        const conversation = chatHistory?.map((msg) => {
            return {
                role: msg.isUser ? "user" : "assistant",
                text: msg.text,
                // add the relevant questions to the conversation history
                userQuestion: tutorResponses?.find(
                    (tr) => tr.lastMessageId === msg.id)
            }
        }).toString();

        console.log(conversation);

        const mistakeBlock = totalMistakes && totalMistakes.length > 0
            ? totalMistakes.map(m => `- [${m.type}] ${m.explanation}`).join("\n")
            : "No mistakes recorded.";

        const correctionBlock = correctedMessages && correctedMessages.length > 0
            ? correctedMessages.map(m => `Original: "${m.text}"\nImproved: "${m.improvedVersion}"`).join("\n\n")
            : "No corrections provided.";

        const existingFacts = linguisticStore && linguisticStore.facts.length > 0
            ? linguisticStore.facts.map((f, i) => `${i + 1}. ${f}`).join("\n")
            : "No existing facts.";

        const existingStrengths = linguisticStore && linguisticStore.strengths?.length > 0
            ? linguisticStore.strengths.map((s, i) => `${i + 1}. ${s}`).join("\n")
            : "No existing strengths.";

        return `You are an expert language coach maintaining a precise, up-to-date linguistic profile for a language learner.
            ## Learner Profile
            - Name: ${userInfo.name ?? "Unknown"}
            - Learning: ${userInfo.language}
            - Level: ${userInfo.level.name} (${userInfo.level.code.toUpperCase()})
            - Mother tongue: ${userInfo.mothertongue ?? "Unknown"}
            ${userInfo.difficulties?.length ? `- Self-reported difficulties: ${userInfo.difficulties.join(", ")}` : ""}
            ${userInfo.learningGoal ? `- Learning goal: ${userInfo.learningGoal}` : ""}

            ## Current Linguistic Store
            ### Summary
            ${linguisticStore?.summary || "No summary yet."}

            ### Known Facts (weak points, recurring errors)
            ${existingFacts}

            ### Known Strengths (areas the learner handles well)
            ${existingStrengths}

            ### Progress Notes
            ${linguisticStore?.progressNotes || "No progress notes yet."}

            ## New Conversation Data
            ### Conversation
            ${conversation}

            ### Mistakes Made
            ${mistakeBlock}

            ### Corrections Given
            ${correctionBlock}

            ## Your Task
            Update the full linguistic store based on the new conversation. Apply these rules strictly:

            **facts — weak points and recurring errors:**
            - Add a new fact only if it reveals a clear, specific linguistic pattern (e.g. "Confuses 'since' and 'for' with present perfect" — not "makes grammar mistakes").
            - A pattern requires at least one concrete example. Be specific. Distinguish mistake types: grammar, vocabulary choice, word order, register, fluency.
            - Remove a fact if the user showed clear improvement (the error did not recur and corrections were fluent in that area).
            - Update a fact to be more precise if you have a better characterization. Merge overlapping facts into one sharper statement.

            **strengths — what the learner does well:**
            - Add a strength only if the learner consistently demonstrated correct, fluent usage in that area with no errors across multiple turns.
            - Be specific and include an example (e.g. "Uses subjunctive correctly in hypothetical clauses: 'si tuviera más tiempo'").
            - Remove a strength if errors in that area reappeared in this session.

            **summary:**
            - Write a concise paragraph (3–6 sentences) describing the learner's current linguistic state.
            - Cover their CEFR-relevant fluency, their most reliable strengths, their most persistent weak points, and overall communicative effectiveness.
            - Tailor the language to be useful for an AI conversation partner adapting to this specific learner.

            **progressNotes:**
            - Write 2–4 sentences describing the learner's trajectory.
            - Identify: (1) weak points that are clearly improving (fewer recurrences, better self-correction), (2) weak points that are fossilizing (persisting despite prior corrections), (3) any newly observed patterns from this session.
            - Be concrete: reference specific error types, not vague categories.

            Return the updated \`facts\`, \`strengths\`, \`summary\`, and \`progressNotes\`. All arrays should contain highly relevant, specific, actionable insights. Remove anything that is no longer accurate.`;
    }

    private getConfig(): GenerateContentConfig {
        return {
            temperature: 0.3,
            responseMimeType: "application/json",
            responseJsonSchema: z.toJSONSchema(LinguisticStoreAIGenerationSchema)
        }
    }

    private validate(rawResponse: string) {
        if (!rawResponse)
            return;

        const jsonResponse = JSON.parse(rawResponse);
        const validatedResponse = LinguisticStoreAIGenerationSchema.safeParse(jsonResponse);

        if (!validatedResponse.success)
            throw new Error("Response of improved version is invalid.");

        return validatedResponse.data;
    }
};