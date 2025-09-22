
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { User } from "@/lib/types";
import { FileText } from "lucide-react";

interface PatientDetailsDialogProps {
  patient: User;
}

export function PatientDetailsDialog({ patient }: PatientDetailsDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <FileText className="mr-2 h-4 w-4" />
          View Details
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Patient Details</DialogTitle>
          <DialogDescription>
            Contact information for {patient.name}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-right font-semibold">Name</span>
            <span className="col-span-3">{patient.name}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-right font-semibold">Email</span>
            <span className="col-span-3">{patient.email}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-right font_semibold">Contact No.</span>
            <span className="col-span-3">{patient.details?.contactNumber || 'Not provided'}</span>
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <span className="text-right font-semibold">Address</span>
            <span className="col-span-3 whitespace-pre-wrap">{patient.details?.address || 'Not provided'}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
