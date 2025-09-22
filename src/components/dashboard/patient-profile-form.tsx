
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { User, PatientDetails } from "@/lib/types";
import { Textarea } from "../ui/textarea";

const formSchema = z.object({
  contactNumber: z.string().min(10, { message: "Please enter a valid contact number." }),
  address: z.string().min(10, { message: "Please enter a complete address." }),
});

type PatientProfileFormValues = z.infer<typeof formSchema>;

interface PatientProfileFormProps {
    user: User;
}

export function PatientProfileForm({ user }: PatientProfileFormProps) {
  const { updateUserProfile } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<PatientProfileFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contactNumber: user.details?.contactNumber || "",
      address: user.details?.address || "",
    },
  });

  function onSubmit(values: PatientProfileFormValues) {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
        updateUserProfile(user.id, values);
        toast({
            title: "Profile Updated",
            description: "Your contact details have been saved.",
        });
        setIsLoading(false);
    }, 1000);
  }

  return (
    <Card>
        <CardHeader>
            <CardTitle>Edit Your Profile</CardTitle>
        </CardHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-6">
                     <FormField
                    control={form.control}
                    name="contactNumber"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Contact Number</FormLabel>
                        <FormControl>
                            <Input placeholder="555-123-4567" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                            <Textarea placeholder="123 Main St, Anytown, USA" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                    </Button>
                </CardFooter>
            </form>
        </Form>
    </Card>
  );
}
