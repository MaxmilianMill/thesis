import { MistakeSchema } from "@thesis/types";
import z from "zod";

export const MistakesSchema = z.array(MistakeSchema);
export type Mistakes = z.infer<typeof MistakesSchema>;
