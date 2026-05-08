import type { GenerateContentConfig } from "@google/genai";
import { LinguisticStoreAIGenerationSchema, LinguisticStoreSchema, type LinguisticStore, type Message, type TutorResponse, type UserInfo, type WithStatus } from "@thesis/types";
import { getInfoData } from "../../repository/setup/info-repository.js";
import { generateLinguisticAnalysis, getLinguisticStore, saveOrUpdateLinguisticStore } from "../../repository/linguistics/linguistic-store-repository.js";
import { getChatMessages } from "../../repository/chat/message-repository.js";
import z from "zod";
import { log } from "../logger/activity-logger-service.js";
import { getTutorAnswers } from "../../repository/chat/tutor-repository.js";
import { validateSchema } from "../../utils/validate-schema.js";

interface IUpdateStateInput {
    uid: string;
    chatId?: string;
};

export class LinguisticStateService {

    async update(data: IUpdateStateInput): Promise<WithStatus<"store", LinguisticStore>> {

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

        log({
            action: "Updated linguistic store",
            status: "success",
            uid,
            relatedIds: {
                lastChatId: chatId ?? "setup"
            }
        })

        console.log(savedStore.store);

        return savedStore;
    }

    public async get(uid: string) {

        const linguisticStore = await getLinguisticStore(uid);

        return validateSchema(linguisticStore.store, LinguisticStoreSchema);
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

            ### Known Facts (weak points, patterns, tendencies)
            ${existingFacts}

            ## New Conversation Data
            ### Conversation
            ${conversation}

            ### Mistakes Made
            ${mistakeBlock}

            ### Corrections Given
            ${correctionBlock}

            ## Your Task
            Update the linguistic store based on the new conversation. Apply these rules strictly:

            **Adding facts:**
            - Add a new fact only if it reveals a clear, specific linguistic pattern (e.g. "Confuses 'since' and 'for' with present perfect" — not "makes grammar mistakes").
            - A pattern requires at least one concrete example from this or prior sessions. Be specific.
            - Distinguish mistake types: grammar, vocabulary choice, word order, register, formulation.

            **Removing or updating facts:**
            - Remove a fact if the user showed clear improvement in this area (i.e. the mistake did not recur and corrected versions are fluent in that area).
            - Update a fact to be more precise if you have a better characterization now.
            - Never keep vague or redundant facts. Merge overlapping facts into one sharper statement.

            **Summary:**
            - Write a concise paragraph (3–6 sentences) describing the user's current linguistic state.
            - Mention their strongest areas, their most persistent weak points, and the trajectory (improving / plateauing / newly emerging issues).
            - Tailor the language to be useful for an AI conversation partner that will adapt its responses to help this specific learner.

            Return the updated \`facts\` array and \`summary\`. The facts array should contain highly relevant, specific, actionable insights. Remove anything that is no longer accurate.`;
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