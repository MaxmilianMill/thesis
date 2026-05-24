import { Brain } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface MemoryTabProps {
  memoryUpdates: string[]
}

export function MemoryTab({ memoryUpdates }: MemoryTabProps) {
  if (memoryUpdates.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-8 text-center text-muted-foreground">
        <Brain className="size-8" />
        <p className="text-sm">No memory updates from this session.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-muted-foreground leading-relaxed">
        Your AI partner updated its memory based on this session.
      </p>
      {memoryUpdates.map((update, index) => (
        <Card key={index} className="border-accent/60 bg-accent/10">
          <CardContent className="flex items-start gap-3 px-4 py-3">
            <Brain className="mt-0.5 size-4 shrink-0 text-primary" />
            <p className="text-sm text-foreground leading-relaxed">{update}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
