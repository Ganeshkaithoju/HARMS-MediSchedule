"use client";

import { AdminDashboard } from "@/components/dashboard/admin-dashboard";
import { DoctorDashboard } from "@/components/dashboard/doctor-dashboard";
import { PatientDashboard } from "@/components/dashboard/patient-dashboard";
import { useAuth } from "@/hooks/use-auth";

export default function DashboardPage() {
  const { user } = useAuth();

  const renderDashboard = () => {
    switch (user?.role) {
      case "patient":
        return <PatientDashboard />;
      case "doctor":
        return <DoctorDashboard />;
      case "admin":
        return <AdminDashboard />;
      default:
        return null; // Or a default/loading view
    }
  };

  return <div className="p-4 md:p-8">{renderDashboard()}</div>;
}
