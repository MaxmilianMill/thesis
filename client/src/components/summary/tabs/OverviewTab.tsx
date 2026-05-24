import { Lightbulb } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface OverviewTabProps {
  overview: string
  recommendations: string[]
}

export function OverviewTab({ overview, recommendations }: OverviewTabProps) {
  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardContent className="px-4 py-3">
          <p className="text-sm text-foreground leading-relaxed">{overview}</p>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Recommendations
        </span>
        {recommendations.map((rec, index) => (
          <Card key={index} className="border-accent/40">
            <CardContent className="flex items-start gap-3 px-4 py-3">
              <Lightbulb className="mt-0.5 size-4 shrink-0 text-secondary" />
              <p className="text-sm text-foreground leading-relaxed">{rec}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
