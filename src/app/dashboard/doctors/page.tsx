
"use client";

import { DoctorList } from "@/components/doctors/doctor-list";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DoctorsPage() {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (user && user.role !== 'admin') {
            router.push('/dashboard');
        }
    }, [user, router]);
    
    if (!user || user.role !== 'admin') {
        return null;
    }

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Doctor Management
        </h1>
        <p className="text-muted-foreground">
          View all doctors in the system and manage their schedules.
        </p>
      </div>
      <DoctorList />
    </div>
  );
}
