import z from "zod";

export const LinguisticStoreAIGenerationSchema = z.object({
    facts: z.array(z.string()).describe("Array of specific, evidence-based weak points and recurring error patterns with concrete examples."),
    strengths: z.array(z.string()).default([]).describe("Array of specific linguistic areas the learner consistently handles well, with examples. Used to calibrate challenge level."),
    summary: z.string().describe("Concise narrative of the learner's overall linguistic state — level, personality, key strengths and weaknesses."),
    progressNotes: z.string().default("").describe("Trajectory analysis: which weak points are improving, which are fossilizing, and any newly observed patterns from this session.")
});

export const LinguisticStoreSchema = z.object({
    ...LinguisticStoreAIGenerationSchema.shape,
    id: z.string().describe("Doc id"),
    uid: z.uuid().describe("Uid of the user"),
    references: z.array(z.string()).describe("Array containing all chat ids that have been used to generate the summary")
});

export type LinguisticStore = z.infer<typeof LinguisticStoreSchema>;