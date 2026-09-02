"use client";

import { MapPin, Briefcase, DollarSign, Calendar, Link, Mail, User, Tag, FileText } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/reusables/status-badge";
import type { JobApplication } from "@/data/mock-data";

function formatSalary(min: number, max: number, currency: string): string {
  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(n);
  return `${fmt(min)} – ${fmt(max)}`;
}

function formatDate(dateString: string): string {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatWorkMode(mode: string): string {
  return mode === "on-site" ? "On-site" : mode.charAt(0).toUpperCase() + mode.slice(1);
}

function formatJobType(type: string): string {
  return type.charAt(0).toUpperCase() + type.slice(1).replace("-", " ");
}

function formatInterviewType(type: string): string {
  const map: Record<string, string> = {
    "phone-screen": "Phone Screen",
    technical: "Technical",
    behavioral: "Behavioral",
    "final-round": "Final Round",
    panel: "Panel",
    other: "Other",
  };
  return map[type] ?? type;
}

function formatInterviewStatus(status: string): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function formatOutcome(outcome: string): string {
  const map: Record<string, string> = {
    passed: "Passed",
    failed: "Failed",
    pending: "Pending",
    "no-response": "No Response",
  };
  return map[outcome] ?? outcome;
}

function DetailRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}

function ApplicationDetailDialog({
  application,
  open,
  onOpenChange,
}: {
  application: JobApplication | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!application) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-base">
            {application.company}
          </DialogTitle>
          <DialogDescription className="flex items-center gap-2">
            {application.title}
            <StatusBadge status={application.status} />
          </DialogDescription>
        </DialogHeader>

        <Separator />

        <div className="grid grid-cols-2 gap-4">
          <DetailRow
            icon={MapPin}
            label="Location"
            value={`${application.location} · ${formatWorkMode(application.workMode)}`}
          />
          <DetailRow
            icon={Briefcase}
            label="Job Type"
            value={formatJobType(application.jobType)}
          />
          <DetailRow
            icon={DollarSign}
            label="Salary"
            value={
              application.salaryMin != null && application.salaryMax != null
                ? formatSalary(application.salaryMin, application.salaryMax, application.currency)
                : "Not specified"
            }
          />
          <DetailRow
            icon={Calendar}
            label="Date Applied"
            value={formatDate(application.dateApplied)}
          />
          <DetailRow
            icon={Link}
            label="Source"
            value={application.source}
          />
          <DetailRow
            icon={User}
            label="Contact"
            value={application.contactName ?? "—"}
          />
          <DetailRow
            icon={Mail}
            label="Email"
            value={application.contactEmail ?? "—"}
          />
        </div>

        {application.notes && (
          <>
            <Separator />
            <div>
              <div className="mb-1 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <FileText className="size-3.5" />
                Notes
              </div>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                {application.notes}
              </p>
            </div>
          </>
        )}

        {application.tags && application.tags.length > 0 && (
          <>
            <Separator />
            <div>
              <div className="mb-1.5 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <Tag className="size-3.5" />
                Tags
              </div>
              <div className="flex flex-wrap gap-1.5">
                {application.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}

        {application.interviews.length > 0 && (
          <>
            <Separator />
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">
                Interviews
              </p>
              <div className="space-y-2">
                {application.interviews.map((interview) => (
                  <div
                    key={interview.id}
                    className="rounded-xl border border-border bg-muted/40 p-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {formatInterviewType(interview.type)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(interview.date)}
                        {interview.time ? ` · ${interview.time}` : ""}
                      </span>
                    </div>
                    {interview.interviewer && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {interview.interviewer}
                      </p>
                    )}
                    <div className="mt-2 flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {formatInterviewStatus(interview.status)}
                      </Badge>
                      {interview.outcome && (
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            interview.outcome === "passed"
                              ? "border-green-300 text-green-600 dark:border-green-600 dark:text-green-400"
                              : interview.outcome === "failed"
                                ? "border-red-300 text-red-600 dark:border-red-600 dark:text-red-400"
                                : ""
                          }`}
                        >
                          {formatOutcome(interview.outcome)}
                        </Badge>
                      )}
                    </div>
                    {interview.notes && (
                      <p className="mt-2 text-xs text-muted-foreground">
                        {interview.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {application.jobUrl && (
          <>
            <Separator />
            <a
              href={application.jobUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-primary underline-offset-4 hover:underline"
            >
              <Link className="size-3.5" />
              View Job Posting
            </a>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export { ApplicationDetailDialog };
