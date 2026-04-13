import z from "zod";

export const SummaryAIGenerationSchema = z.object({
    overview: z.string().describe("A brief linguistic overview what the user achieved in the session."),
    fluencyScore: z.number().max(100).min(0).describe("Fluency score of the conversation"),
    recommendations: z.array(z.string().describe("Up to 5 recommendations/clarifications that help the user improve his language skills.")).max(5).describe("Array of recommendations"),
    importantVocabulary: z.array(z.string().describe("List key or difficult words that the user should repeat.")).max(10).describe("Array of important vocabulary")
});

export const SummarySchema = z.object({
    ...SummaryAIGenerationSchema.shape,
    id: z.string(),
    uid: z.string(),
    chatId: z.string(),
    createdAt: z.date(),
    wordCount: z.number()
});

export type Summary = z.infer<typeof SummarySchema>;