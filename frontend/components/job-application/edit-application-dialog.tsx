"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { JobApplicationForm } from "./job-application-form";
import type { JobApplication } from "@/data/mock-data";

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
    await onUpdate(application.id, data);
    onOpenChange(false);
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
