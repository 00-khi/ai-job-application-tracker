"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InterviewForm } from "./interview-form";
import { toast } from "sonner";
import type { CreateInterviewInput } from "@/lib/job-applications";

interface CreateInterviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateInterviewInput) => Promise<void>;
}

export function CreateInterviewDialog({
  open,
  onOpenChange,
  onSubmit,
}: CreateInterviewDialogProps) {
  async function handleSubmit(data: CreateInterviewInput) {
    try {
      await onSubmit(data);
      toast.success("Interview added");
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add interview");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Interview</DialogTitle>
        </DialogHeader>
        <InterviewForm
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          submitLabel="Add Interview"
        />
      </DialogContent>
    </Dialog>
  );
}
