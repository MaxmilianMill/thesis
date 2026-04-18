import { AlertCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface FeedbackItem {
  mistake: string
  explanation: string
}

interface FeedbackTabProps {
  feedback: FeedbackItem[]
}

export function FeedbackTab({ feedback }: FeedbackTabProps) {
  if (feedback.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-8 text-center text-muted-foreground">
        <AlertCircle className="size-8" />
        <p className="text-sm">No mistakes found. Excellent work!</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {feedback.map((item, index) => (
        <Card key={index}>
          <CardContent className="flex flex-col gap-2 px-4 py-3">
            <div className="rounded-md bg-destructive/10 px-3 py-2">
              <p className="text-sm font-medium text-destructive leading-relaxed">
                &ldquo;{item.mistake}&rdquo;
              </p>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{item.explanation}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
