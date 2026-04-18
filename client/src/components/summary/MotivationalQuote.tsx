import { Card, CardContent } from "@/components/ui/card"

const QUOTES = [
  { text: "Every language is a different vision of life.", author: "Federico Fellini" },
  { text: "To have another language is to possess a second soul.", author: "Charlemagne" },
  { text: "The limits of my language are the limits of my world.", author: "Ludwig Wittgenstein" },
  { text: "Language is the road map of a culture.", author: "Rita Mae Brown" },
  {
    text: "A different language is a different life.",
    author: "Czech Proverb",
  },
]

const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)]

interface MotivationalQuoteProps {
  wordCount: number
}

export function MotivationalQuote({ wordCount }: MotivationalQuoteProps) {
  return (
    <div className="flex flex-col items-center gap-1 pb-2 text-center">
      <span className="text-3xl font-bold text-foreground">Session Complete!</span>
      <span className="text-sm text-muted-foreground">
        You spoke <span className="font-semibold text-primary">{wordCount} words</span> today
      </span>
      <Card className="mt-3 w-full border-accent/40 bg-accent/20">
        <CardContent className="px-4 py-3">
          <p className="text-sm italic text-muted-foreground leading-relaxed">
            &ldquo;{quote.text}&rdquo;
          </p>
          <p className="mt-1 text-xs font-medium text-primary">— {quote.author}</p>
        </CardContent>
      </Card>
    </div>
  )
}
