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

export function CreateApplicationDialog({
  open,
  onOpenChange,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (data: Omit<JobApplication, "id" | "interviews" | "createdAt" | "updatedAt">) => Promise<JobApplication>;
}) {
  async function handleSubmit(data: Omit<JobApplication, "id" | "interviews" | "createdAt" | "updatedAt">) {
    await onCreate(data);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Application</DialogTitle>
          <DialogDescription>
            Track a new job application in your pipeline.
          </DialogDescription>
        </DialogHeader>
        <JobApplicationForm
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
