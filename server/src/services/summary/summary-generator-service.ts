import type { GenerateContentConfig } from "@google/genai";
import type { Message } from "@thesis/types";
import type { UserInfo } from "@thesis/types";
import z from "zod";
import { SummaryAIGenerationSchema, type Summary } from "@thesis/types";
import { generateSummary, saveOrUpdateSummary } from "../../repository/summary/summary-repository.js";
import { validateSchema } from "../../utils/validate-schema.js";
import type { WithStatus } from "@thesis/types";

interface IGenerateSummary {
    userInfo: UserInfo;
    chatId: string;
    history: Message[];
};

export class SummaryGenerationService {

    public async generate(data: IGenerateSummary): Promise<WithStatus<"summary", Summary>> {

        const {
            userInfo,
            chatId,
            history
        } = data;

        const prompt = this.buildPrompt(history, userInfo);
        const config = this.getConfig();

        const rawResponse = await generateSummary(prompt, config);

        console.log(rawResponse);
        const validatedResponse = validateSchema(rawResponse, SummaryAIGenerationSchema);

        const wordCount = this.countWords(history);

        const summary: Omit<Summary, "id"> = {
            ...validatedResponse,
            uid: userInfo.uid,
            createdAt: new Date(),
            chatId,
            wordCount
        };

        return await saveOrUpdateSummary(userInfo.uid, chatId, summary);
    };

    private countWords(history: Message[]) {
        const userMessages = history.filter((msg) => msg.isUser);
        
        // counts each word in each user message
        return userMessages.reduce(
            (prev, msg) => msg.text.split(" ").length + prev, 0);
    }

    private buildPrompt(
        history: Message[],
        userInfo: UserInfo
    ) {
        return `
            You are a supportive language learning coach. Analyze the following conversation and generate an encouraging,
            constructive session summary.

            ## Student Profile
            - Name: ${userInfo.name ?? "the student"}
            - Target language: ${userInfo.language.name} (${userInfo.language.code})
            - Proficiency level: ${userInfo.level.name} (${userInfo.level.code})
            - Interests: ${userInfo.interests.join(", ")}

            ## Conversation History
            ${history
            .map(m => `[${m.isUser ? "Student" : "Partner"}]: ${m.text}`)
            .join("\n")}

            ## Your Task
            Return a JSON object with the following fields:

            1. **overview** — 2–3 warm, encouraging sentences summarising what the student achieved linguistically this
            session (vocabulary used, structures attempted, topics covered).

            2. **fluencyScore** — an integer 0–100 reflecting overall language fluency and accuracy in this session.
                Scoring guide:
                - 0–40: Many basic errors, communication frequently broken
                - 41–65: Noticeable errors but meaning usually clear
                - 66–80: Mostly fluent with occasional errors
                - 81–100: Near-native fluency and accuracy

            3. **recommendations** — an array of up to 5 short, actionable tips to help the student improve. Focus on the
            most impactful issues from this session (grammar patterns, vocabulary gaps, pronunciation hints if relevant).
            Each tip should be one sentence, written directly to the student ("Try using…", "Practice…", "Remember that…").

            4. **importantVocabulary** — an array of up to 10 words or short phrases from the conversation that the student
            should review or memorise. Prefer words the student used incorrectly or words the partner introduced that were
            new/difficult.

            Be encouraging and positive in tone. Acknowledge effort, not just errors.
        `
    };

    private getConfig(): GenerateContentConfig {
        return {
            temperature: 0.3,
            responseMimeType: "application/json",
            responseJsonSchema: z.toJSONSchema(SummaryAIGenerationSchema)
        };
    };
};