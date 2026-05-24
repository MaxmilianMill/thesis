import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import type { Summary } from "@thesis/types"
import { generateSummary } from "@/lib/api/summaryApi"
import { useAuthSelectors } from "@/contexts/useAuthStore"
import { useChatSelectors } from "@/contexts/useChatStore"

function isLastChat(group: string, condition: string): boolean {
  return (
    (group === "control_first" && condition === "experiment") ||
    (group === "experiment_first" && condition === "control")
  )
}

export function useSummary() {
  const navigate = useNavigate()
  const [summary, setSummary] = useState<Summary | null>(null)
  const [memoryUpdates, setMemoryUpdates] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const user = useAuthSelectors.use.user()
  const resetUser = useAuthSelectors.use.resetUser()
  const chat = useChatSelectors.use.chat()
  const history = useChatSelectors.use.history()

  useEffect(() => {
    if (!user || !chat) return

    const chatId = chat.id

    async function load() {
      const { summary: summaryData, newFacts } = await generateSummary(chatId, history, chat?.condition)
      setSummary(summaryData)
      setMemoryUpdates(newFacts)
      setIsLoading(false)
    }

    load()
  }, [user, chat])

  const navigateToNextSession = () => {
    if (user && chat && isLastChat(user.group, chat.condition)) {
      localStorage.setItem("participated", "true");
      ["user", "token", "uid"].forEach((k) => localStorage.removeItem(k));
      resetUser();
      navigate("/thankyou");
    } else {
      navigate("/study");
    }
  }

  return { summary, memoryUpdates, isLoading, navigateToNextSession }
}
