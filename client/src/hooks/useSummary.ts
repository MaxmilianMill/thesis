import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import type { Summary } from "@thesis/types"
import { generateSummary, getMemoryUpdates } from "@/lib/api/summaryApi"

const CHAT_ID = "69e20e992c9192317f8b7613"
const UID = "1e17ebf2-74b1-4468-80d6-d11dcc8196f2"

export function useSummary() {
  const navigate = useNavigate()
  const [summary, setSummary] = useState<Summary | null>(null)
  const [memoryUpdates, setMemoryUpdates] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [summaryData, memoryData] = await Promise.all([
        generateSummary(CHAT_ID),
        getMemoryUpdates(UID),
      ])
      setSummary(summaryData)
      setMemoryUpdates(memoryData)
      setIsLoading(false)
    }

    load()
  }, [])

  const navigateToNextSession = () => navigate("/study")

  return { summary, memoryUpdates, isLoading, navigateToNextSession }
}
