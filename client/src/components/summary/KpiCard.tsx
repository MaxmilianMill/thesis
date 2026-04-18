import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface KpiCardProps {
  icon: LucideIcon
  value: number
  label: string
  color?: "primary" | "secondary" | "success" | "destructive"
}

const colorMap = {
  primary: "text-primary",
  secondary: "text-secondary",
  success: "text-success",
  destructive: "text-destructive",
}

export function KpiCard({ icon: Icon, value, label, color = "primary" }: KpiCardProps) {
  return (
    <Card className="flex-1 min-w-0">
      <CardContent className="flex flex-col items-center gap-1 px-3 py-3">
        <Icon className={cn("size-5", colorMap[color])} />
        <span className={cn("text-2xl font-bold leading-none", colorMap[color])}>{value}</span>
        <span className="text-center text-xs text-muted-foreground leading-tight">{label}</span>
      </CardContent>
    </Card>
  )
}
