
"use client";

import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Appointment, Role, User } from "@/lib/types";
import { BookAppointmentDialog } from "./book-appointment-dialog";
import { format, isFuture, parseISO } from "date-fns";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { PatientDetailsDialog } from "../patients/patient-details-dialog";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface AppointmentListProps {
  role: Role;
  userId: string;
  showBookButton?: boolean;
  maxRows?: number;
  filterToday?: boolean;
}

export function AppointmentList({
  role,
  userId,
  showBookButton = false,
  maxRows,
  filterToday = false,
}: AppointmentListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const { appointments, addAppointment, updateAppointmentStatus, doctors, users } = useAuth();
  const { toast } = useToast();


  const filteredAppointments = useMemo(() => {
    let items = appointments;

    if (role === "patient") {
      items = items.filter((apt) => apt.patientId === userId);
    } else if (role === "doctor") {
      items = items.filter((apt) => apt.doctorId === userId);
    }
    
    if (filterToday) {
        const today = format(new Date(), "yyyy-MM-dd");
        items = items.filter((apt) => apt.date === today);
    }

    if (searchTerm) {
      items = items.filter(
        (apt) =>
          apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          apt.doctorName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return items.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [appointments, role, userId, searchTerm, filterToday]);

  const displayedAppointments = maxRows ? filteredAppointments.slice(0, maxRows) : filteredAppointments;

  const handleAppointmentBooked = (newAppointment: Appointment) => {
    addAppointment(newAppointment);
    toast({
        title: "Appointment Request Sent",
        description: "Your request has been sent to the doctor for confirmation."
    });
  };

  const handleStatusUpdate = async (appointmentId: string, newStatus: Appointment['status']) => {
    const appointment = appointments.find(a => a.id === appointmentId);
    if (!appointment) return;

    updateAppointmentStatus(appointmentId, newStatus);
    
    const patient = users.find(u => u.id === appointment.patientId);

    toast({
        title: `Appointment ${newStatus}`,
        description: `The appointment with ${appointment.patientName} has been ${newStatus.toLowerCase()}.`
    });

    // If confirmed, trigger the email notification by writing to Firestore
    if (newStatus === 'Confirmed' && patient && db) {
      try {
        const mailRef = collection(db, "mail");
        await addDoc(mailRef, {
            to: [patient.email],
            message: {
                subject: "Your Appointment is Confirmed!",
                html: `
                    <h1>Appointment Confirmation</h1>
                    <p>Hello ${patient.name},</p>
                    <p>This is a confirmation that your appointment with <strong>${appointment.doctorName}</strong> has been scheduled successfully.</p>
                    <p><strong>Date:</strong> ${format(new Date(appointment.date), 'EEE, MMM d, yyyy')}</p>
                    <p><strong>Time:</strong> ${appointment.time}</p>
                    <p>Thank you for choosing MediSchedule.</p>
                `,
            },
            createdAt: serverTimestamp(),
        });

        toast({
            title: "Confirmation Email Triggered",
            description: `A confirmation email has been queued for ${patient.email}.`,
        });

      } catch (error) {
        console.error("Error triggering email:", error);
        toast({
            variant: "destructive",
            title: "Email Trigger Failed",
            description: "Could not write to the mail collection to trigger the email.",
        });
      }
    }
  }

  const getStatusBadgeVariant = (status: Appointment['status']) => {
    switch (status) {
        case "Confirmed": return "default";
        case "Completed": return "secondary";
        case "Cancelled": return "destructive";
        case "Pending": return "outline";
        default: return "outline";
    }
  }
  
  const getPatientById = (patientId: string): User | undefined => {
    return users.find(u => u.id === patientId && u.role === 'patient');
  }

  const canCancel = (appointment: Appointment) => {
    if (role !== 'patient') return false;
    if (appointment.status !== 'Pending' && appointment.status !== 'Confirmed') return false;
    // Combine date and a dummy time part for parsing, then check if it's in the future.
    // This is a simplified check. A robust solution would parse appointment.time.
    return isFuture(parseISO(appointment.date));
  }
  
  const colSpan = role === 'patient' ? 5 : (role === 'doctor' ? 5 : 6);


  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-4">
        <Input
          placeholder="Search by patient or doctor..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        {showBookButton && (
          <BookAppointmentDialog onAppointmentBooked={handleAppointmentBooked} doctors={doctors} appointments={appointments} />
        )}
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{role === 'patient' ? 'Doctor' : 'Patient'}</TableHead>
              {(role === 'doctor' || role === 'admin') && <TableHead>Patient Details</TableHead>}
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedAppointments.length > 0 ? (
              displayedAppointments.map((appointment) => {
                const patient = getPatientById(appointment.patientId);
                return (
                    <TableRow key={appointment.id}>
                    <TableCell className="font-medium">
                        {role === 'patient' ? appointment.doctorName : appointment.patientName}
                    </TableCell>
                    {(role === 'doctor' || role === 'admin') && (
                        <TableCell>
                            {patient ? <PatientDetailsDialog patient={patient} /> : 'N/A'}
                        </TableCell>
                    )}
                    <TableCell>{format(new Date(appointment.date), 'EEE, MMM d, yyyy')}</TableCell>
                    <TableCell>{appointment.time}</TableCell>
                    <TableCell>
                        <Badge variant={getStatusBadgeVariant(appointment.status)}>
                        {appointment.status}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                        {role !== 'patient' && appointment.status === 'Pending' && (
                            <>
                                <Button size="sm" onClick={() => handleStatusUpdate(appointment.id, 'Confirmed')}>Confirm</Button>
                                <Button size="sm" variant="destructive" onClick={() => handleStatusUpdate(appointment.id, 'Cancelled')}>Cancel</Button>
                            </>
                        )}
                        {role !== 'patient' && appointment.status === 'Confirmed' && (
                            <Button size="sm" variant="secondary" onClick={() => handleStatusUpdate(appointment.id, 'Completed')}>Complete</Button>
                        )}
                        {role === 'patient' && canCancel(appointment) && (
                           <Button size="sm" variant="destructive" onClick={() => handleStatusUpdate(appointment.id, 'Cancelled')}>Cancel</Button>
                        )}
                    </TableCell>
                    </TableRow>
                )
            })
            ) : (
              <TableRow>
                <TableCell colSpan={colSpan} className="text-center">
                  No appointments found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
