
"use client";

import { useState, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format, isSameDay, parse } from "date-fns";
import {
  Calendar as CalendarIcon,
  Loader2,
  PlusCircle,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Appointment, Doctor } from "@/lib/types";
import { timeSlots as allTimeSlots } from "@/lib/data";
import { useAuth } from "@/hooks/use-auth";

const formSchema = z.object({
  patientName: z.string().min(2, { message: "Patient name is required." }).optional(),
  doctorId: z.string({ required_error: "Please select a doctor." }),
  date: z.date({ required_error: "A date is required." }),
  time: z.string({ required_error: "Please select a time." }),
});

type BookAppointmentFormValues = z.infer<typeof formSchema>;

interface BookAppointmentDialogProps {
  onAppointmentBooked: (appointment: Appointment) => void;
  doctors: Doctor[];
  appointments: Appointment[];
  doctor?: Doctor;
}

export function BookAppointmentDialog({
  onAppointmentBooked,
  doctors,
  appointments,
  doctor: preselectedDoctor,
}: BookAppointmentDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<BookAppointmentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      doctorId: preselectedDoctor?.id || "",
    }
  });

  const selectedDoctorId = form.watch("doctorId");
  const selectedDate = form.watch("date");

  const availableTimeSlots = useMemo(() => {
    if (!selectedDoctorId || !selectedDate) {
      return allTimeSlots;
    }

    const formattedDate = format(selectedDate, "yyyy-MM-dd");
    const bookedSlots = appointments
      .filter(
        (apt) =>
          apt.doctorId === selectedDoctorId &&
          apt.date === formattedDate &&
          (apt.status === "Confirmed" || apt.status === "Pending")
      )
      .map((apt) => apt.time);

    let unbookedSlots = allTimeSlots.filter((slot) => !bookedSlots.includes(slot));

    // If the selected date is today, filter out past time slots
    if (isSameDay(selectedDate, new Date())) {
      const now = new Date();
      unbookedSlots = unbookedSlots.filter((slot) => {
        const slotTime = parse(slot, "hh:mm a", new Date());
        return slotTime > now;
      });
    }

    return unbookedSlots;
  }, [selectedDoctorId, selectedDate, appointments]);


  const onSubmit = async (data: BookAppointmentFormValues) => {
    if (!user) return;
    
    if (user.role === 'admin' && !data.patientName) {
        form.setError("patientName", { type: "manual", message: "Patient name is required for admin bookings."});
        return;
    }

    setIsLoading(true);

    const doctor = doctors.find((d) => d.id === data.doctorId);
    if (!doctor) {
        setIsLoading(false);
        return;
    }

    const isSlotAvailable = availableTimeSlots.includes(data.time);

    if (isSlotAvailable) {
        handleBooking(data);
    } else {
        toast({
            variant: "destructive",
            title: "Slot Unavailable",
            description: "This time slot is no longer available. Please select another time.",
        });
    }
   
    setIsLoading(false);
  };

  const handleBooking = (data: BookAppointmentFormValues) => {
     if (!user) return;

    const doctor = doctors.find((d) => d.id === data.doctorId);
    if (!doctor) return;

    const patientId = user.role === 'admin' ? `patient-${Date.now()}` : user.id;
    const patientName = user.role === 'admin' ? data.patientName! : user.name;

    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      patientId: patientId,
      patientName: patientName,
      doctorId: data.doctorId,
      doctorName: doctor.name,
      date: format(data.date, "yyyy-MM-dd"),
      time: data.time,
      status: "Pending",
    };

    onAppointmentBooked(newAppointment);
    toast({
        title: "Appointment Request Sent",
        description: "Your request has been sent to the doctor for confirmation."
    });
    
    setOpen(false);
    form.reset({ doctorId: preselectedDoctor?.id || "" });
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) {
        form.reset({ doctorId: preselectedDoctor?.id || "" });
      }
    }}>
      <DialogTrigger asChild>
        <Button onClick={() => form.setValue("doctorId", preselectedDoctor?.id || "")}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Book Appointment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Book a New Appointment</DialogTitle>
          <DialogDescription>
            {user?.role === 'admin' ? "Enter patient and appointment details. The request will be sent for doctor's confirmation." : "Select a doctor and your preferred date and time. Your request will be sent for confirmation."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            {user?.role === 'admin' && (
                 <FormField
                    control={form.control}
                    name="patientName"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Patient Name</FormLabel>
                        <FormControl>
                            <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            )}
            <FormField
              control={form.control}
              name="doctorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Doctor</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      form.setValue("time", "");
                    }}
                    defaultValue={field.value}
                    disabled={!!preselectedDoctor}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a doctor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {doctors.map((doctor) => (
                        <SelectItem key={doctor.id} value={doctor.id}>
                          {doctor.name} - {doctor.specialty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          field.onChange(date);
                          form.setValue("time", "");
                        }}
                        disabled={(date) => {
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            return date < today;
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={!selectedDoctorId || !selectedDate}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a time slot" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableTimeSlots.length > 0 ? (
                        availableTimeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-slots" disabled>
                          No available slots for this day
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="ghost">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={isLoading}>
                {isLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Request Appointment
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
