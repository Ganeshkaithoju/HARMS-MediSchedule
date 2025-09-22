
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";


const formSchema = z.object({
  patientId: z.string({ required_error: "Please select a patient." }).min(1, "Please select a patient."),
  message: z.string().min(1, { message: "Message cannot be empty." }).min(10, { message: "Message must be at least 10 characters." }),
});

type NotificationFormValues = z.infer<typeof formSchema>;

export function SendNotificationForm() {
  const { user, users } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const patients = users.filter(u => u.role === 'patient');

  const form = useForm<NotificationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        patientId: "",
        message: "",
    }
  });

  const onSubmit = async (data: NotificationFormValues) => {
    setIsLoading(true);
    if (!db) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Firebase is not configured. Please add your API keys.",
        });
        setIsLoading(false);
        return;
    }
    const patient = users.find(u => u.id === data.patientId);
    if (!patient) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Patient not found.",
        });
        setIsLoading(false);
        return;
    }

    try {
        const mailRef = collection(db, "mail");
        await addDoc(mailRef, {
            to: [patient.email],
            message: {
                subject: "A message from MediSchedule",
                html: `<p>${data.message}</p>`,
            },
            createdAt: serverTimestamp(),
        });

        toast({
            title: "Notification Queued",
            description: `An email has been queued to be sent to ${patient.email}.`,
        });
        form.reset({ patientId: "", message: "" });
    } catch (error) {
        console.error("Error writing to mail collection:", error);
        toast({
            variant: "destructive",
            title: "Trigger Failed",
            description: "Could not write to the database to trigger the email.",
        });
    }

    setIsLoading(false);
  };
  
  if (user?.role !== 'admin') {
    return (
        <div className="p-4 md:p-8">
            <h1 className="text-2xl font-bold">Access Denied</h1>
            <p>You do not have permission to view this page.</p>
        </div>
    )
  }

  return (
    <Card className="max-w-2xl mx-auto">
    <CardHeader>
        <CardTitle>Compose Message</CardTitle>
        <CardDescription>Select a patient and write a message. This will queue an email to be sent via the backend.</CardDescription>
    </CardHeader>
    <CardContent>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="patientId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Patient</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a patient to notify" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                {patients.map((p) => (
                                    <SelectItem key={p.id} value={p.id}>
                                    {p.name} ({p.email})
                                    </SelectItem>
                                ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Message</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Type your message to the patient here."
                                    className="resize-none"
                                    rows={5}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Send Notification
                </Button>
            </form>
        </Form>
    </CardContent>
    </Card>
  );
}
