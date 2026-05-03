import z from "zod";

export const LinguisticStoreAIGenerationSchema = z.object({
    facts: z.array(z.string()).describe("Array of factual details representing the lingiustic state of the user, f.e. his weak points."),
    summary: z.string().describe("Linguistic summary of the user")
});

export const LinguisticStoreSchema = z.object({
    ...LinguisticStoreAIGenerationSchema.shape,
    id: z.string().describe("Doc id"),
    uid: z.uuid().describe("Uid of the user"),
    references: z.array(z.string()).describe("Array containing all chat ids that have been used to generate the summary")
});

export type LinguisticStore = z.infer<typeof LinguisticStoreSchema>;