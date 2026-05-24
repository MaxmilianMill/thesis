import { BookOpen, MessageSquare, Mic, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { MotivationalQuote } from "@/components/summary/MotivationalQuote"
import { KpiCard } from "@/components/summary/KpiCard"
import { OverviewTab } from "@/components/summary/tabs/OverviewTab"
import { FeedbackTab } from "@/components/summary/tabs/FeedbackTab"
import { VocabularyTab } from "@/components/summary/tabs/VocabularyTab"
import { MemoryTab } from "@/components/summary/tabs/MemoryTab"
import { SummarySkeleton } from "@/components/summary/SummarySkeleton"
import { useSummary } from "@/hooks/useSummary"

export default function SummaryScreen() {
  const { summary, memoryUpdates, isLoading, navigateToNextSession } = useSummary()

  if (isLoading || !summary) {
    return (
      <div className="dark min-h-screen bg-background">
        <SummarySkeleton />
      </div>
    )
  }

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-lg flex-col gap-5 px-4 py-8 pb-24">
        <MotivationalQuote wordCount={summary.wordCount} />

        <div className="flex gap-3">
          <KpiCard icon={Mic} value={summary.wordCount} label="Words spoken" color="primary" />
          <KpiCard
            icon={AlertTriangle}
            value={summary.feedback.length}
            label="Mistakes made"
            color="destructive"
          />
          <KpiCard
            icon={BookOpen}
            value={summary.importantVocabulary.length}
            label="Words learned"
            color="success"
          />
        </div>
      
        <Tabs defaultValue="overview" className="flex w-full flex-col">
          <TabsList className="w-full">
            <TabsTrigger value="overview" className="flex-1">
              Overview
            </TabsTrigger>
            <TabsTrigger value="feedback" className="flex-1">
              <MessageSquare className="size-3.5" />
              Feedback
            </TabsTrigger>
            <TabsTrigger value="vocabulary" className="flex-1">
              <BookOpen className="size-3.5" />
              Vocabulary
            </TabsTrigger>
            <TabsTrigger value="memory" className="flex-1">
              Memory
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4">
            <OverviewTab overview={summary.overview} recommendations={summary.recommendation} />
          </TabsContent>

          <TabsContent value="feedback" className="mt-4">
            <FeedbackTab feedback={summary.feedback} />
          </TabsContent>

          <TabsContent value="vocabulary" className="mt-4">
            <VocabularyTab vocabulary={summary.importantVocabulary} />
          </TabsContent>

          <TabsContent value="memory" className="mt-4">
            <MemoryTab memoryUpdates={memoryUpdates} />
          </TabsContent>
        </Tabs>
      </div>

      <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-background/90 px-4 py-4 backdrop-blur-sm">
        <div className="mx-auto w-full max-w-lg">
          <Card className="p-0 ring-0">
            <Button
              className="h-11 w-full text-base font-semibold"
              onClick={navigateToNextSession}
            >
              Next Session
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
