import { BookOpen } from "lucide-react"

interface VocabularyTabProps {
  vocabulary: string[]
}

export function VocabularyTab({ vocabulary }: VocabularyTabProps) {
  if (vocabulary.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-8 text-center text-muted-foreground">
        <BookOpen className="size-8" />
        <p className="text-sm">No vocabulary to review.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground leading-relaxed">
        Review these words to reinforce what you practiced today.
      </p>
      <div className="flex flex-wrap gap-2">
        {vocabulary.map((word, index) => (
          <span
            key={index}
            className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
          >
            {word}
          </span>
        ))}
      </div>
    </div>
  )
}
