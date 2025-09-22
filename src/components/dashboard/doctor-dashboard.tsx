"use client";

import { useAuth } from "@/hooks/use-auth";
import { AppointmentList } from "../appointments/appointment-list";
import { format } from "date-fns";

export function DoctorDashboard() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-8">
       <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Good day, {user.name}
        </h1>
        <p className="text-muted-foreground">
          Here are your appointments for today, {format(new Date(), "MMMM do, yyyy")}.
        </p>
      </div>
      <AppointmentList
        role="doctor"
        userId={user.id}
        filterToday={true}
      />
    </div>
  );
}
