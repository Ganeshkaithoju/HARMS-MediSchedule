

"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { users as initialUsers, appointments as initialAppointments, doctors as initialDoctors, resources as initialResources } from "@/lib/data";
import { Role, User, Appointment, Doctor, Resource, PatientDetails } from "@/lib/types";
import { useToast } from "./use-toast";

interface SignupData {
  name: string;
  email: string;
  role: Role;
}

interface AuthContextType {
  user: User | null;
  users: User[];
  doctors: Doctor[];
  appointments: Appointment[];
  resources: Resource[];
  login: (email: string, password?: string) => boolean;
  logout: () => void;
  signup: (data: SignupData) => { success: boolean; message?: string };
  addAppointment: (appointment: Appointment) => void;
  updateAppointmentStatus: (appointmentId: string, status: Appointment['status']) => void;
  updateDoctorProfile: (doctorData: Doctor) => void;
  updateUserProfile: (userId: string, details: PatientDetails) => void;
  addResource: (resource: Resource) => void;
  updateResourceStatus: (resourceId: string, status: Resource['status']) => void;
  updateResourceQuantity: (resourceId: string, change: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("medi-schedule-user");
      const storedUsers = localStorage.getItem("medi-schedule-users");
      const storedAppointments = localStorage.getItem("medi-schedule-appointments");
      const storedDoctors = localStorage.getItem("medi-schedule-doctors");
      const storedResources = localStorage.getItem("medi-schedule-resources");

      if (storedUser) setUser(JSON.parse(storedUser));
      
      setUsers(storedUsers ? JSON.parse(storedUsers) : initialUsers);
      setAppointments(storedAppointments ? JSON.parse(storedAppointments) : initialAppointments);
      setDoctors(storedDoctors ? JSON.parse(storedDoctors) : initialDoctors);
      setResources(storedResources ? JSON.parse(storedResources) : initialResources);

    } catch (error) {
      console.error("Failed to parse from localStorage", error);
      // Fallback to initial data if localStorage is corrupt
      setUsers(initialUsers);
      setAppointments(initialAppointments);
      setDoctors(initialDoctors);
      setResources(initialResources);
    }
  }, []);

  const updateLocalStorage = (key: string, data: any) => {
      localStorage.setItem(key, JSON.stringify(data));
  }

  const login = useCallback((email: string, password?: string) => {
    // In a real app, you'd verify the password. Here we just find the user.
    const userToLogin = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (userToLogin) {
      setUser(userToLogin);
      updateLocalStorage("medi-schedule-user", userToLogin);
      router.push("/dashboard");
      return true;
    }
    return false;
  }, [users, router]);

  const signup = useCallback((data: SignupData) => {
    const existingUser = users.find((u) => u.email.toLowerCase() === data.email.toLowerCase());
    if (existingUser) {
        return { success: false, message: "A user with this email already exists." };
    }

    const newUser: User = {
        id: `user-${Date.now()}`,
        name: data.name,
        email: data.email,
        role: data.role,
        avatar: `user-${data.role}`,
        details: data.role === 'patient' ? { contactNumber: '', address: '' } : undefined,
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    updateLocalStorage("medi-schedule-users", updatedUsers);
    
    if (newUser.role === 'doctor') {
      const newDoctor: Doctor = {
        id: newUser.id,
        name: newUser.name,
        specialty: "General Medicine",
        avatar: `user-doctor`,
        experience: 0,
        contactNumber: "Not specified"
      };
      const updatedDoctors = [...doctors, newDoctor];
      setDoctors(updatedDoctors);
      updateLocalStorage("medi-schedule-doctors", updatedDoctors);
    }

    setUser(newUser);
    updateLocalStorage("medi-schedule-user", newUser);

    return { success: true };
  }, [users, doctors]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("medi-schedule-user");
    router.push("/");
  }, [router]);

  const addAppointment = useCallback((appointment: Appointment) => {
    const updatedAppointments = [...appointments, appointment];
    setAppointments(updatedAppointments);
    updateLocalStorage("medi-schedule-appointments", updatedAppointments);
  }, [appointments]);

   const updateAppointmentStatus = useCallback((appointmentId: string, status: Appointment['status']) => {
    const updatedAppointments = appointments.map(a => a.id === appointmentId ? { ...a, status } : a);
    setAppointments(updatedAppointments);
    updateLocalStorage("medi-schedule-appointments", updatedAppointments);
  }, [appointments]);

  const updateDoctorProfile = useCallback((doctorData: Doctor) => {
    const updatedDoctors = doctors.map(d => d.id === doctorData.id ? doctorData : d);
    setDoctors(updatedDoctors);
    updateLocalStorage("medi-schedule-doctors", updatedDoctors);

    const updatedUsers = users.map(u => u.id === doctorData.id ? { ...u, name: doctorData.name } : u);
    setUsers(updatedUsers);
    updateLocalStorage("medi-schedule-users", updatedUsers);
    if(user && user.id === doctorData.id) {
        const updatedUser = { ...user, name: doctorData.name};
        setUser(updatedUser);
        updateLocalStorage("medi-schedule-user", updatedUser);
    }

    const updatedAppointments = appointments.map(appt => 
      appt.doctorId === doctorData.id ? { ...appt, doctorName: doctorData.name } : appt
    );
    setAppointments(updatedAppointments);
    updateLocalStorage("medi-schedule-appointments", updatedAppointments);
  }, [doctors, appointments, users, user]);

  const updateUserProfile = useCallback((userId: string, details: PatientDetails) => {
    const updatedUsers = users.map(u => u.id === userId ? { ...u, details } : u);
    setUsers(updatedUsers);
    updateLocalStorage("medi-schedule-users", updatedUsers);

    if (user && user.id === userId) {
        const updatedUser = { ...user, details };
        setUser(updatedUser);
        updateLocalStorage("medi-schedule-user", updatedUser);
    }
  }, [users, user]);

  const addResource = useCallback((resource: Resource) => {
    const updatedResources = [...resources, resource];
    setResources(updatedResources);
    updateLocalStorage("medi-schedule-resources", updatedResources);
  }, [resources]);


  const updateResourceStatus = useCallback((resourceId: string, newStatus: Resource['status']) => {
    const updatedResources = resources.map(r => r.id === resourceId ? { ...r, status: newStatus } : r);
    setResources(updatedResources);
    updateLocalStorage("medi-schedule-resources", updatedResources);
    
    const resource = resources.find(r => r.id === resourceId);
    if (!resource) return;

    if (resource.type === 'Bed' && newStatus === 'Occupied') {
        const availableBeds = updatedResources.filter(r => r.type === 'Bed' && r.status === 'Available').length;
        if (availableBeds === 0) {
            toast({
                variant: "destructive",
                title: "Bed Alert",
                description: "All beds are now occupied."
            });
        }
    }

    if (resource.type === 'Equipment') {
        const availableCount = updatedResources.filter(r => r.type === resource.type && r.status === 'Available').length;
        if (availableCount === 0) {
            toast({
                variant: "destructive",
                title: "Equipment Alert",
                description: `All ${resource.type} are now occupied.`
            });
        }
    }

    if (newStatus === 'Low Stock' && resource.type === 'Medicine') {
         toast({
            variant: "destructive",
            title: "Low Stock Alert",
            description: `"${resource.name}" is now low in stock.`
        });
    }
  }, [resources, toast]);

    const updateResourceQuantity = useCallback((resourceId: string, change: number) => {
    // This is a placeholder now, the main logic is in updateResourceStatus
  }, []);

  return (
    <AuthContext.Provider value={{ user, users, doctors, appointments, resources, login, logout, signup, addAppointment, updateAppointmentStatus, updateDoctorProfile, updateUserProfile, addResource, updateResourceStatus, updateResourceQuantity }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
