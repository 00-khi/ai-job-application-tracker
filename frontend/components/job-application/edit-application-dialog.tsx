"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { JobApplicationForm } from "./job-application-form";
import { toast } from "sonner";
import type { JobApplication } from "@/lib/types";

export function EditApplicationDialog({
  application,
  open,
  onOpenChange,
  onUpdate,
}: {
  application: JobApplication | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (id: string, data: Omit<JobApplication, "id" | "interviews" | "createdAt" | "updatedAt">) => Promise<JobApplication>;
}) {
  if (!application) return null;

  async function handleSubmit(data: Omit<JobApplication, "id" | "interviews" | "createdAt" | "updatedAt">) {
    if (!application) return;
    try {
      await onUpdate(application.id, data);
      toast.success("Application updated");
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update application");
      throw err;
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Application</DialogTitle>
          <DialogDescription>
            Update details for {application.company} — {application.title}.
          </DialogDescription>
        </DialogHeader>
        <JobApplicationForm
          initialData={application}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
