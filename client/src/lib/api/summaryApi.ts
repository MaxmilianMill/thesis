import type { Summary } from "@thesis/types"

const MOCK_SUMMARY: Summary = {
  id: "summary-001",
  uid: "1e17ebf2-74b1-4468-80d6-d11dcc8196f2",
  chatId: "69e20e992c9192317f8b7613",
  createdAt: new Date(),
  wordCount: 157,
  fluencyScore: 72,
  overview:
    "You had a solid conversation at the coffee shop. You managed to express your order clearly and engaged well with the barista. Your sentence structure was mostly correct, though you occasionally struggled with article usage and prepositions in more complex phrases.",
  recommendation: [
    "Practice using definite and indefinite articles (the, a, an) more consistently.",
    "Work on prepositions of place and direction — 'at', 'in', 'on' can be tricky in English.",
    "Try to use more connective phrases like 'however', 'in addition', or 'on the other hand'.",
    "Review polite request forms such as 'Could I have…' and 'Would it be possible to…'",
    "Listen to native English speakers in everyday contexts to absorb natural phrasing.",
  ],
  feedback: [
    {
      mistake: "I would like order a large cappuccino.",
      explanation:
        "After modal verbs like 'would like', use the infinitive without 'to' — 'I would like to order a large cappuccino.'",
    },
    {
      mistake: "Can I have the recipe?",
      explanation:
        "'Recipe' refers to cooking instructions. The correct word here is 'receipt' — a proof of payment.",
    },
    {
      mistake: "The coffee is very delicious today.",
      explanation:
        "'Delicious' is already a strong, absolute adjective. Drop 'very' — just say 'The coffee is delicious today.'",
    },
  ],
  importantVocabulary: [
    "receipt",
    "cappuccino",
    "barista",
    "specials",
    "to-go",
    "oat milk",
    "double shot",
    "loyalty card",
    "artisan",
    "brew",
  ],
}

const MOCK_MEMORY_UPDATES: string[] = [
  "Needs practice with '-tion' suffix nouns (e.g. 'recommendation', 'pronunciation').",
  "Tends to omit articles before countable nouns in fast speech.",
  "Strong vocabulary around food and drink — can expand to restaurant and hospitality contexts.",
]

export async function generateSummary(_chatId: string): Promise<Summary> {
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_SUMMARY), 800))
}

export async function getMemoryUpdates(_uid: string): Promise<string[]> {
  return new Promise((resolve) =>
    setTimeout(() => resolve(MOCK_MEMORY_UPDATES), 600)
  )
}
