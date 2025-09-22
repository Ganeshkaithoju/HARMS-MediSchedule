
"use client";

import { AppointmentList } from "@/components/appointments/appointment-list";
import { useAuth } from "@/hooks/use-auth";

export default function AppointmentsPage() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Manage Appointments
        </h1>
        <p className="text-muted-foreground">
          View, filter, and manage all appointments in the system.
        </p>
      </div>
      <AppointmentList role={user.role} userId={user.id} showBookButton={user.role === 'patient' || user.role === 'admin'} />
    </div>
  );
}
