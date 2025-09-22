import { SignupForm } from "@/components/auth/signup-form";
import { Icons } from "@/components/icons";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-4">
            <Icons.logo className="h-16 w-16 text-primary" />
            <h1 className="text-5xl font-bold tracking-tighter font-headline">
              MediSchedule
            </h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Create your account to start managing your healthcare.
          </p>
        </div>
        <Card className="w-full max-w-md mx-auto shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-headline text-center">
              Create an Account
            </CardTitle>
            <CardDescription className="text-center">
              Fill out the form below to get started.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SignupForm />
          </CardContent>
           <CardFooter className="flex flex-col gap-4">
            <div className="text-center text-sm text-muted-foreground">
              Already have an account?
            </div>
             <Button variant="outline" className="w-full" asChild>
                <Link href="/">Log In</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
