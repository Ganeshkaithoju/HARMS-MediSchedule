import { LoginForm } from "@/components/auth/login-form";
import { Icons } from "@/components/icons";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
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
            Streamlining healthcare appointments and resource management with
            ease and efficiency.
          </p>
          <p className="text-md text-muted-foreground pt-4">
            Log in to your account to manage appointments, view schedules, and
            access hospital resources.
          </p>
        </div>
        <Card className="w-full max-w-md mx-auto shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-headline text-center">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-center">Enter your credentials to log in.</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <div className="text-center text-sm text-muted-foreground">
              Don't have an account?
            </div>
             <Button variant="outline" className="w-full" asChild>
                <Link href="/signup">Sign Up Now</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
