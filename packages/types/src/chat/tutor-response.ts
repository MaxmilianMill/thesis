import z from "zod";

export const TutorResponseSchema = z.object({
  category: z.enum([
    "CONVERSATIONAL_CONTINUATION",
    "GRAMMAR_CLARIFICATION",
    "VOCABULARY_QUERY",
    "CULTURAL_CONTEXT",
    "CORRECTION_REQUEST",
    "META_INSTRUCTION"
  ]).describe(`
    Categorize the user's input to determine the response strategy:
    - CONVERSATIONAL_CONTINUATION: Casual talk or answering a tutor's question.
    - GRAMMAR_CLARIFICATION: Asking why a sentence is structured a certain way.
    - VOCABULARY_QUERY: Asking for a translation or the meaning of a word.
    - CULTURAL_CONTEXT: Asking about customs, idioms, or regional etiquette.
    - CORRECTION_REQUEST: Specifically asking 'Did I say that right?'.
    - META_INSTRUCTION: User asking to change the topic, slow down, or stop the session.
  `),
  
  explanation: z.string().describe("A brief explanation of the linguistic concept, if applicable."),
  
  response_text: z.string().describe("The actual reply to the user in his mothertongue and target language."),

  response_type: z.enum(["text", "md"]).describe("Type of the response_text. Text if its just a simple message, md if its markdown"),
  
  suggested_next_steps: z.array(z.string()).max(3).describe("2-3 short follow-up phrases the user could say next to keep the flow.")
});

export type TutorResponse = z.infer<typeof TutorResponseSchema> & {
    uid: string;
    id: string;
    chatId: string;
    createdAt: Date;
    lastMessageId: string;
};