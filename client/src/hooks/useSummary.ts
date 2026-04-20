import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import type { Summary } from "@thesis/types"
import { generateSummary, getMemoryUpdates } from "@/lib/api/summaryApi"
import { useAuthSelectors } from "@/contexts/useAuthStore"
import { useChatSelectors } from "@/contexts/useChatStore"

export function useSummary() {
  const navigate = useNavigate()
  const [summary, setSummary] = useState<Summary | null>(null)
  const [memoryUpdates, setMemoryUpdates] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const user = useAuthSelectors.use.user()
  const chat = useChatSelectors.use.chat()
  const history = useChatSelectors.use.history()

  useEffect(() => {
    if (!user || !chat) return

    const uid = user.authToken.uid
    const chatId = chat.id

    async function load() {
      const [summaryData, memoryData] = await Promise.all([
        generateSummary(chatId, history),
        getMemoryUpdates(uid),
      ])
      setSummary(summaryData)
      setMemoryUpdates(memoryData)
      setIsLoading(false)
    }

    load()
  }, [user, chat])

  const navigateToNextSession = () => navigate("/study")

  return { summary, memoryUpdates, isLoading, navigateToNextSession }
}
