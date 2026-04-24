import type { GenerateContentConfig } from "@google/genai";
import type { Message, UserInfo } from "@thesis/types";
import { generateTutorAnswer } from "../../repository/chat/tutor-repository.js";
import { TutorResponseSchema, type TutorResponse } from "@thesis/types";
import { toJSONSchema } from "zod";

interface IUserQuestion {
    userInfo: UserInfo;
    question: string;
    history?: Message[];
};

/**
 * Handles in-chat questions about the current conversation
 */
export class TutorService {

    public async generate(data: IUserQuestion) {
        
        const prompt = this.buildPrompt(data);
        const config = this.getConfig();

        const response = await generateTutorAnswer(
            prompt,
            config
        );

        return this.validate(response);
    }

    private validate(
        rawText: string
    ): Omit<TutorResponse, "uid" | "chatId" | "id" | "createdAt"> {

        const jsonResponse = JSON.parse(rawText);
        const validatedResponse = TutorResponseSchema.safeParse(jsonResponse);

        if (!validatedResponse.success) {
            throw new Error(validatedResponse.error.message);
        };

        return validatedResponse.data;
    }

    private buildPrompt({ userInfo, question, history }: IUserQuestion): string {
        const { language, level, mothertongue, name } = userInfo;

        const historyBlock = history && history.length > 0
            ? history
                .map(m => `${m.isUser ? (name ?? "User") : "AI Partner"}: ${m.text}`)
                .join("\n")
            : null;

        return `You are a helpful language tutor assistant. The user is learning ${language} at a ${level} level.${mothertongue ? ` Their native language is ${mothertongue}.` : ""}

        ${historyBlock ? `
            Here is the recent conversation the user has been having with their AI language partner:\n\n${historyBlock}\n\n` : ""}
            The user now has the following question:\n${question}

            Guidelines:
            - For simple questions (e.g. a quick translation, vocabulary, or yes/no), respond with a short plain-text answer.
            - For more complex explanations (e.g. conjugation tables, grammar rules, lists of examples), use markdown — tables, bullet points, or headers as appropriate.
            - Calibrate the depth and vocabulary of your explanation to a ${level} learner.${mothertongue ? `\n- You may use ${mothertongue} to clarify a concept when it genuinely helps understanding, but prefer ${language} where possible.` : ""}
            - If the question refers to a mistake in the conversation above, pinpoint the exact error, explain why it is wrong, and provide the correct form.
            - Be encouraging and concise. Do not pad your answer.`;
    }

    private getConfig(): GenerateContentConfig {
        return {
            temperature: 0.7,
            responseJsonSchema: toJSONSchema(TutorResponseSchema),
            responseMimeType: "application/json"
        }
    }
}