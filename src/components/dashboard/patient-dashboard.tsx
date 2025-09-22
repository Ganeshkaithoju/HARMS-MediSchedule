
"use client";

import { useAuth } from "@/hooks/use-auth";
import { AppointmentList } from "../appointments/appointment-list";
import { BookAppointmentDialog } from "../appointments/book-appointment-dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "../ui/button";
import { Stethoscope } from "lucide-react";

export function PatientDashboard() {
  const { user, doctors, appointments, addAppointment } = useAuth();

  if (!user) return null;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Welcome, {user.name}!
        </h1>
        <p className="text-muted-foreground">
          Here's a summary of your upcoming appointments. You can book a new one
          at any time.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Your Appointments</CardTitle>
            <CardDescription>A view of your latest scheduled appointments.</CardDescription>
          </CardHeader>
          <CardContent>
            <AppointmentList
              role="patient"
              userId={user.id}
              showBookButton={true}
              maxRows={5}
            />
          </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Our Doctors</CardTitle>
                <CardDescription>Find a specialist and book an appointment.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {doctors.map(doctor => {
                    const userImage = PlaceHolderImages.find((img) => img.id === doctor.avatar);
                    return (
                        <div key={doctor.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={userImage?.imageUrl} alt={doctor.name} data-ai-hint={userImage?.imageHint} />
                                    <AvatarFallback>{getInitials(doctor.name)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="font-semibold">{doctor.name}</h3>
                                    <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                                    <p className="text-xs text-muted-foreground">{doctor.experience} years experience</p>
                                </div>
                            </div>
                            <BookAppointmentDialog onAppointmentBooked={addAppointment} doctors={doctors} appointments={appointments} doctor={doctor} />
                        </div>
                    )
                })}
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
