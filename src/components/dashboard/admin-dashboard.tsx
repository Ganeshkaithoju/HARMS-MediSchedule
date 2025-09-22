
"use client";

import { useAuth } from "@/hooks/use-auth";
import { AppointmentList } from "../appointments/appointment-list";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";


export function AdminDashboard() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Administrator Dashboard
        </h1>
        <p className="text-muted-foreground">
          Manage appointments and hospital resources from here.
        </p>
      </div>
       <div className="grid gap-8 lg:grid-cols-2">
        <Card>
            <CardHeader>
                <CardTitle>Recent Appointments</CardTitle>
                <CardDescription>A view of the latest scheduled appointments.</CardDescription>
            </CardHeader>
            <CardContent>
                <AppointmentList role="admin" userId={user.id} maxRows={5} />
            </CardContent>
        </Card>
         <Card>
            <CardHeader>
                <CardTitle>System Management</CardTitle>
                 <CardDescription>Access detailed management pages.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                        <h3 className="font-semibold">Doctors</h3>
                        <p className="text-sm text-muted-foreground">View all doctors and their schedules.</p>
                    </div>
                    <Button asChild>
                        <Link href="/dashboard/doctors">Go to Doctors <ArrowRight className="ml-2" /></Link>
                    </Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                        <h3 className="font-semibold">Resources</h3>
                        <p className="text-sm text-muted-foreground">Manage beds, equipment, and medicine.</p>
                    </div>
                     <Button asChild>
                        <Link href="/dashboard/resources">Go to Resources <ArrowRight className="ml-2" /></Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
