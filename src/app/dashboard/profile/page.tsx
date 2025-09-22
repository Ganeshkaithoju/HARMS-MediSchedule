
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { DoctorProfileForm } from "@/components/dashboard/doctor-profile-form";
import { PatientProfileForm } from "@/components/dashboard/patient-profile-form";
import { Doctor, PatientDetails } from "@/lib/types";

export default function ProfilePage() {
  const { user, doctors } = useAuth();

  if (!user) {
    return null;
  }
  
  const userImage = PlaceHolderImages.find((img) => img.id === user.avatar);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
  };

  const doctorDetails = user.role === 'doctor' 
    ? doctors.find((d: Doctor) => d.id === user.id) 
    : undefined;

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold tracking-tight font-headline mb-8">
        User Profile
      </h1>
      <div className="grid md:grid-cols-3 gap-8">
        <Card className="md:col-span-1">
          <CardHeader>
            <div className="flex flex-col items-center gap-4 text-center">
              <Avatar className="h-28 w-28">
                <AvatarImage src={userImage?.imageUrl} alt={user.name} data-ai-hint={userImage?.imageHint} />
                <AvatarFallback className="text-4xl">{getInitials(user.name)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{doctorDetails?.name || user.name}</CardTitle>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="text-center">
            <div className="space-y-2">
              <p><strong>Role:</strong> <span className="capitalize">{user.role}</span></p>
              {user.role === 'doctor' && doctorDetails && (
                <>
                  <p><strong>Specialty:</strong> {doctorDetails.specialty}</p>
                  <p><strong>Experience:</strong> {doctorDetails.experience} years</p>
                  <p><strong>Contact:</strong> {doctorDetails.contactNumber}</p>
                </>
              )}
               {user.role === 'patient' && user.details && (
                <>
                  <p><strong>Contact:</strong> {user.details.contactNumber}</p>
                  <p><strong>Address:</strong> {user.details.address}</p>
                </>
              )}
            </div>
          </CardContent>
        </Card>
        <div className="md:col-span-2">
            {user.role === 'doctor' && doctorDetails ? (
                <DoctorProfileForm doctor={doctorDetails} />
            ) : user.role === 'patient' ? (
                 <PatientProfileForm user={user} />
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">This is a placeholder page. More profile settings and information will be available here in the future.</p>
                    </CardContent>
                </Card>
            )}
        </div>
      </div>
    </div>
  );
}
