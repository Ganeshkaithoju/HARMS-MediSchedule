
"use client";

import { AppointmentList } from "@/components/appointments/appointment-list";
import { useAuth } from "@/hooks/use-auth";
import { Doctor } from "@/lib/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useParams } from "next/navigation";

export default function DoctorAppointmentsPage() {
  const { user, doctors } = useAuth();
  const params = useParams();
  const doctorId = params.doctorId as string;

  if (!user || user.role !== 'admin') {
    return (
        <div className="p-4 md:p-8">
             <h1 className="text-2xl font-bold">Access Denied</h1>
             <p>You do not have permission to view this page.</p>
        </div>
    )
  }

  const doctor = doctors.find((d: Doctor) => d.id === doctorId);

  return (
    <div className="p-4 md:p-8">
        <div className="mb-8">
            <Button variant="ghost" asChild className="mb-4">
                <Link href="/dashboard/doctors">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Doctors
                </Link>
            </Button>
            <h1 className="text-3xl font-bold tracking-tight font-headline">
                Appointments for {doctor ? doctor.name : 'Doctor'}
            </h1>
            <p className="text-muted-foreground">
                Viewing all scheduled appointments for {doctor ? doctor.name : 'the selected doctor'}.
            </p>
        </div>
      <AppointmentList role="doctor" userId={doctorId} showBookButton={true} />
    </div>
  );
}
