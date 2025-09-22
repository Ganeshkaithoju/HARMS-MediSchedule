
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
import { Doctor } from "@/lib/types";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  specialty: z.string().min(2, { message: "Specialty is required." }),
  experience: z.coerce.number().min(0, { message: "Experience must be a positive number." }),
  contactNumber: z.string().min(10, { message: "Please enter a valid contact number." }),
});

type DoctorProfileFormValues = z.infer<typeof formSchema>;

interface DoctorProfileFormProps {
    doctor: Doctor;
}

export function DoctorProfileForm({ doctor }: DoctorProfileFormProps) {
  const { updateDoctorProfile } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<DoctorProfileFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: doctor.name || "",
      specialty: doctor.specialty || "",
      experience: doctor.experience || 0,
      contactNumber: doctor.contactNumber || "",
    },
  });

  function onSubmit(values: DoctorProfileFormValues) {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const updatedDoctor: Doctor = {
        ...doctor,
        ...values,
      };
      updateDoctorProfile(updatedDoctor);
      toast({
        title: "Profile Updated",
        description: "Your professional details have been saved.",
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
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Display Name</FormLabel>
                        <FormControl>
                            <Input placeholder="Dr. John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="specialty"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Specialty</FormLabel>
                        <FormControl>
                            <Input placeholder="Cardiology" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="experience"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Years of Experience</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="5" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
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
