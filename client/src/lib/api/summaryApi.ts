import type { Chat, Message, Summary } from "@thesis/types"
import { api } from "./config"
import { HttpStatusCode } from "axios"

export async function generateSummary(
  chatId: string,
  history: Message[],
  condition?: Chat["condition"]
): Promise<{ summary: Summary; newFacts: string[] }> {
  return await api.post("/summary/generate", { chatId, history, condition }).then((res) => {
    if (res.status !== HttpStatusCode.Created) return { summary: null, newFacts: [] };

    const { newFacts, ...rest } = res.data;
    return { summary: rest as Summary, newFacts: newFacts ?? [] };
  }).catch((error) => {
    console.error(error.message);
    return { summary: null as unknown as Summary, newFacts: [] };
  });
}
