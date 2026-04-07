import z from "zod";

export const ImprovedVersionSchema = z.string(
    `The improved version of the user message with incorrect words/sections in []. 
    Return nothing if message is correct.`
).optional();

export type ImprovedVersion = z.infer<typeof ImprovedVersionSchema>;