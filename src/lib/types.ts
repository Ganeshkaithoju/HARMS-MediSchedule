

export type Role = "patient" | "doctor" | "admin";

export interface PatientDetails {
    contactNumber: string;
    address: string;
}
export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  details?: PatientDetails;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  avatar: string;
  experience: number;
  contactNumber: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
}

export interface Resource {
    id: string;
    name: string;
    type: 'Bed' | 'Equipment' | 'Medicine';
    status: 'Available' | 'Occupied' | 'Low Stock';
}
