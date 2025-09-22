

import type { Doctor, User, Appointment, Resource } from "./types";
import { subDays, addDays, format } from "date-fns";

export const doctors: Doctor[] = [
  { id: "doc-1", name: "Dr. Evelyn Reed", specialty: "Cardiology", avatar: "doctor-1", experience: 15, contactNumber: "555-0101" },
  { id: "doc-2", name: "Dr. Marcus Thorne", specialty: "Neurology", avatar: "doctor-2", experience: 12, contactNumber: "555-0102" },
  { id: "doc-3", name: "Dr. Lena Petrova", specialty: "Pediatrics", avatar: "doctor-3", experience: 8, contactNumber: "555-0103" },
  { id: "doc-4", name: "Dr. Samuel Chen", specialty: "Dermatology", avatar: "doctor-4", experience: 10, contactNumber: "555-0104" },
];

export const users: User[] = [
  { id: "user-1", name: "Alex Johnson", email: "patient@example.com", role: "patient", avatar: "user-patient", details: { contactNumber: "555-1234", address: "123 Health St, Wellness City" } },
  { id: "user-2", name: "Dr. Evelyn Reed", email: "doctor@example.com", role: "doctor", avatar: "user-doctor" },
  { id: "user-3", name: "Maria Garcia", email: "admin@example.com", role: "admin", avatar: "user-admin" },
];

const today = new Date();

export const appointments: Appointment[] = [
  {
    id: "apt-1",
    patientId: "user-1",
    patientName: "Alex Johnson",
    doctorId: "doc-1",
    doctorName: "Dr. Evelyn Reed",
    date: format(addDays(today, 2), "yyyy-MM-dd"),
    time: "10:00 AM",
    status: "Confirmed",
  },
  {
    id: "apt-2",
    patientId: "user-p2",
    patientName: "Jane Smith",
    doctorId: "doc-1",
    doctorName: "Dr. Evelyn Reed",
    date: format(addDays(today, 2), "yyyy-MM-dd"),
    time: "11:00 AM",
    status: "Pending",
  },
  {
    id: "apt-3",
    patientId: "user-p3",
    patientName: "Robert Brown",
    doctorId: "doc-2",
    doctorName: "Dr. Marcus Thorne",
    date: format(addDays(today, 3), "yyyy-MM-dd"),
    time: "02:00 PM",
    status: "Confirmed",
  },
  {
    id: "apt-4",
    patientId: "user-1",
    patientName: "Alex Johnson",
    doctorId: "doc-3",
    doctorName: "Dr. Lena Petrova",
    date: format(addDays(today, 5), "yyyy-MM-dd"),
    time: "09:30 AM",
    status: "Pending",
  },
    {
    id: "apt-5",
    patientId: "user-p4",
    patientName: "Emily Davis",
    doctorId: "doc-1",
    doctorName: "Dr. Evelyn Reed",
    date: format(subDays(today, 1), "yyyy-MM-dd"),
    time: "03:00 PM",
    status: "Completed",
  },
];

export const resources: Resource[] = [
    { id: 'bed-101', name: 'Ward A, Bed 101', type: 'Bed', status: 'Available' },
    { id: 'bed-102', name: 'Ward A, Bed 102', type: 'Bed', status: 'Occupied' },
    { id: 'bed-103', name: 'Ward A, Bed 103', type: 'Bed', status: 'Available' },
    { id: 'eq-01', name: 'Ventilator 1', type: 'Equipment', status: 'Available' },
    { id: 'eq-02', name: 'X-Ray Machine', type: 'Equipment', status: 'Occupied' },
    { id: 'med-01', name: 'Paracetamol', type: 'Medicine', status: 'Available' },
    { id: 'med-02', name: 'Amoxicillin', type: 'Medicine', status: 'Low Stock' },
]

export const timeSlots = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
    "04:00 PM"
]
