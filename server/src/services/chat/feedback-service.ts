import type { GenerateContentConfig } from "@google/genai";
import type { Chat } from "@thesis/types";
import type { Message, Mistake } from "@thesis/types";
import type { UserInfo } from "@thesis/types";
import { ImprovedVersionSchema } from "./schemas/improved-version.js";
import { MistakesSchema } from "./schemas/mistakes.js";
import z from "zod";
import type { Language } from "@thesis/types";
import type { Level } from "@thesis/types";
import { improveVersion, generateMistakes } from "../../repository/chat/feedback-repository.js";

export interface IFeedbackInput {
    userInfo: UserInfo;
    chat: Chat;
    message: Message;
    history?: Message[] | undefined;
};

export class FeedbackService {

    public async generateFeedback(data: IFeedbackInput) {
        const updatedMessage = await this.generateImprovedVersion(data);

        if (updatedMessage.improvedVersion) {
            const mistakes = await this.generateMistakesForMessage(
                data.message.text,
                updatedMessage.improvedVersion
            );
            return { ...updatedMessage, mistakes };
        }

        return updatedMessage;
    };

    private async generateImprovedVersion(data: IFeedbackInput): Promise<Message> {
        const {
            userInfo,
            message,
            history
        } = data;

        const prompt = this.buildImprovedVersionPrompt(
            userInfo.language,
            userInfo.level,
            message,
            history
        );

        const config = this.getConfig(0.1, ImprovedVersionSchema);

        const rawResponse = await improveVersion(prompt, config);

        const validatedResponse = this.validateImprovedVersion(rawResponse);

        // return the updated message
        return {...message, ...(validatedResponse ? 
            {isCorrect: false, improvedVersion: validatedResponse} : 
            {isCorrect: true}
        )};
    };

    private async generateMistakesForMessage(
        originalText: string,
        improvedVersion: string
    ): Promise<Mistake[]> {
        const hasBrackets = /\[.+?\]/.test(improvedVersion);
        if (!hasBrackets) return [];

        const prompt = this.buildMistakesPrompt(originalText, improvedVersion);
        const config = this.getConfig(0.1, MistakesSchema);

        const rawResponse = await generateMistakes(prompt, config);
        return this.validateMistakes(rawResponse);
    };

    private buildMistakesPrompt(originalText: string, improvedVersion: string) {
        return `You are a language error classifier.

            You are given a learner's original message and the same message with their mistakes marked in [square brackets].
            For each bracketed mistake, return:
            - "type": one of "grammar", "spelling", or "formulation"
            - "explanation": one sentence explaining the mistake clearly

            Return a JSON array with one entry per mistake, in the same order they appear.

            Important:
            - "grammar" = incorrect verb form, wrong tense, missing article, wrong preposition, subject-verb agreement, etc.
            - "spelling" = misspelled word (e.g. "relly" instead of "really")
            - "formulation" = awkward or unnatural phrasing that is grammatically acceptable but sounds wrong to a native speaker
            - Keep explanations short and direct (one sentence max).

            Original message: "${originalText}"
            Message with marked mistakes: "${improvedVersion}"
        `;
    };

    private validateMistakes(rawResponse?: string): Mistake[] {
        if (!rawResponse) return [];

        const jsonResponse = JSON.parse(rawResponse);
        const validated = MistakesSchema.safeParse(jsonResponse);

        if (!validated.success)
            throw new Error("Response of mistakes is invalid.");

        return validated.data;
    };

    private buildImprovedVersionPrompt(
        language: Language,
        level: Level,
        userMessage: Message,
        history?: Message[] 
    ) {
        return `Act as a helpful language tutor.
            You are given a learner's message in ${language.name}. The learner's proficiency level is ${level.name} - ${level.code}.
            This message was generated via speech-to-text and punctuation & capitalization was augmented by a prompt.
            Do not treat those as mistakes.

            Your task is to identify and mark only clear, confident mistakes in the learner's message. This includes errors in grammar, spelling, and unnatural formulation.

            You are also provided with a partner message (the previous message in the conversation), which the learner is replying to. Use it as context only if needed.

            1. Analyse the user message for mistakes in grammar, spelling and formulation.
            2. Mark the incorrect words & mistakes in [] brackets.
            3. Return the user messages with marks for corrections.

            Important:
            - NEVER add corrections or explanations. Just return the original user message with mistakes wrapped in square brackets [like this].
            - NEVER correct punctuation & minor-stylistic mistakes, since the user has no control over that.
            - ONLY correct clear mistakes in grammar, spelling and formulation.
            - ONLY mark mistakes if you are completely sure. If you're unsure, leave it unmarked.
            - If there are no clear mistakes, return the original message unaltered.

            Examples of expected output format:
            - "yes [it was relly] nice i [loved the histroy] and the atmosphere"
            - "I like cooking more because I enjoy experimenting with different ingredients"
            - "[i have to make my homeworks] before i can go out"
            - "oui [c'était trés interessent] mais un peu long"
            - "Mañana voy a visitar a mis abuelos y después voy al cine con mi hermana."

            The Goal:
            - The user is able to identify his/her mistakes and improve his/her speaking skills.

            Input:
            Partner Message (context): ${JSON.stringify(history)}

            User message: ${userMessage.text}
        `;
    };

    private getConfig(
        temperature: number,
        schema: any
    ): GenerateContentConfig {
        return {
            temperature,
            responseMimeType: "application/json",
            responseJsonSchema: z.toJSONSchema(schema),
            thinkingConfig: {
                thinkingBudget: 0
            }
        }
    };

    private validateImprovedVersion(rawResponse?: string): string | undefined {
        if (!rawResponse)
            return;

        const jsonResponse = JSON.parse(rawResponse);
        const validatedResponse = ImprovedVersionSchema.safeParse(jsonResponse);

        if (!validatedResponse.success)
            throw new Error("Response of improved version is invalid.");

        return validatedResponse.data;
    };
};