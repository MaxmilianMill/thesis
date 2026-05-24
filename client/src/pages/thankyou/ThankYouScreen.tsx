import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ThankYouScreen() {
  return (
    <div className="dark min-h-screen bg-background text-foreground p-6 md:p-10 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-3xl font-bold tracking-tight">
              Thank you for participating!
            </CardTitle>
            <CardDescription className="text-text-muted">
              You have successfully completed all sessions of the study.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-text-muted">
            <p>
              The study is now over. Your responses have been recorded and will
              contribute to the research. We truly appreciate your time and
              effort.
            </p>
            <p>
              If you have any questions, please reach out at{" "}
              <a
                href="mailto:ugntp@student.kit.edu"
                className="text-primary underline underline-offset-4"
              >
                ugntp@student.kit.edu
              </a>
              .
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
