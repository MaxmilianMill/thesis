import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader, 
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from '@/hooks/useAuth';
import { useSetupSelectors } from '@/contexts/useSetupStore';

// define a schema for form validation
const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

export default function GetStartedScreen() {
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();
  const {authenticate} = useAuth();
  const updateDraft = useSetupSelectors.use.updateDraft();

  // initialize react-hook-form
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  // handle form submission and routing
  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Starting study with username:", values.username);
    
    const authenticated = await authenticate(values.username);

    if (!authenticated) return;
    
    updateDraft({
      name: values.username, 
      language: {code: "es", name: "spanish"}
    });

    navigate('/setup');
  }

  return (
    // changed to a flex layout to center the active card perfectly on the screen
    <div className="dark min-h-screen bg-background text-foreground p-6 md:p-10 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        
        {/* conditionally render either the intro OR the form */}
        {!showForm ? (
          
          /* --- VIEW 1: STUDY INTRODUCTION --- */
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-3xl font-bold tracking-tight">
                Welcome to My Study
              </CardTitle>
              <CardDescription className="text-text-muted">
                A brief overview of the research and the process.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-text-muted">
              <p>
                Thank you for participating! This application is part of my master's thesis research.
                My study aims to understand user interaction with web-based tools for data analysis.
                Your participation is crucial for my research and is greatly appreciated.
              </p>
              <p>
                The process is simple: First, you'll provide a username so I know how to refer to your data anonymously.
                Then, you will be presented with a set of tasks to complete using a prototype data analysis tool.
                Each task should take about 15-20 minutes.
              </p>
              <p>
                Finally, you'll be asked to complete a short questionnaire about your experience.
                All your data will be kept confidential and used only for research purposes.
                You can withdraw from the study at any time.
              </p>
            </CardContent>
            <CardFooter>
              <Button 
                className="bg-primary text-primary-foreground w-full sm:w-auto"
                onClick={() => setShowForm(true)} // swaps the view
              >
                Start Study
              </Button>
            </CardFooter>
          </Card>

        ) : (

          /* --- VIEW 2: USERNAME FORM --- */
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-3xl font-bold tracking-tight">
                Ready to Begin?
              </CardTitle>
              <CardDescription className="text-text-muted">
                You'll have 4 hours to complete the study after clicking start.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label>How should we call you?</Label>
                  <Input 
                    id="username"
                    placeholder="e.g. Explorer123" 
                    className="border-input"
                    {...register("username")}
                  />
                  {/* render zod validation errors */}
                  {errors.username && (
                    <p className="text-sm font-medium text-destructive">
                      {errors.username.message}
                    </p>
                  )}
                </div>
                
                {/* using flex to align the back button and submit button */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setShowForm(false)} // lets the user go back to read the instructions
                    className="w-full sm:w-auto border-border text-foreground hover:bg-muted"
                  >
                    Back
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-primary text-primary-foreground w-full sm:w-auto"
                  >
                    Let's go!
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

        )}
      </div>
    </div>
  );
}