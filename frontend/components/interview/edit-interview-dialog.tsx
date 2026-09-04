"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InterviewForm } from "./interview-form";
import { toast } from "sonner";
import type { CreateInterviewInput, JobApplication } from "@/lib/job-applications";

interface EditInterviewDialogProps {
  interview: JobApplication["interviews"][number] | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateInterviewInput) => Promise<void>;
}

export function EditInterviewDialog({
  interview,
  open,
  onOpenChange,
  onSubmit,
}: EditInterviewDialogProps) {
  async function handleSubmit(data: CreateInterviewInput) {
    try {
      await onSubmit(data);
      toast.success("Interview updated");
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update interview");
    }
  }

  if (!interview) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Interview</DialogTitle>
        </DialogHeader>
        <InterviewForm
          initialData={interview}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          submitLabel="Update Interview"
        />
      </DialogContent>
    </Dialog>
  );
}
