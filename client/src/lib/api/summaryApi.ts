import type { Message, Summary } from "@thesis/types"
import { api } from "./config"
import { HttpStatusCode } from "axios"

const MOCK_MEMORY_UPDATES: string[] = [
  "Needs practice with '-tion' suffix nouns (e.g. 'recommendation', 'pronunciation').",
  "Tends to omit articles before countable nouns in fast speech.",
  "Strong vocabulary around food and drink — can expand to restaurant and hospitality contexts.",
]

export async function generateSummary(chatId: string, history: Message[]): Promise<Summary> {
  return await api.post("/summary/generate", {chatId, history}).then((res) => {
    if (res.status !== HttpStatusCode.Created) return;

    return res.data as Summary;
  }).catch((error) => {
    console.error(error.message);
    return; 
  })
}

export async function getMemoryUpdates(_uid: string): Promise<string[]> {
  return new Promise((resolve) =>
    setTimeout(() => resolve(MOCK_MEMORY_UPDATES), 600)
  )
}
