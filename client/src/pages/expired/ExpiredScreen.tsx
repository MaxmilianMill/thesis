import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ExpiredScreen() {
  return (
    <div className="dark min-h-screen bg-background text-foreground p-6 md:p-10 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-3xl font-bold tracking-tight">
              You've already participated
            </CardTitle>
            <CardDescription className="text-text-muted">
              Each participant can only complete the study once.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-text-muted">
            <p>
              Your session token has expired or you have already completed the study.
              For fairness and data integrity, participation is limited to one session per person.
            </p>
            <p>
              If you believe this is an error, please reach out at{" "}
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
