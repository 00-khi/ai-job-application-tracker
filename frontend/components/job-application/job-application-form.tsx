"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2Icon } from "lucide-react";
import type { JobApplication } from "@/data/mock-data";
import { statusConfig } from "@/components/reusables/status-badge";

type FormData = {
  company: string;
  title: string;
  location: string;
  workMode: JobApplication["workMode"] | "";
  jobType: JobApplication["jobType"] | "";
  salaryMin: string;
  salaryMax: string;
  currency: string;
  status: JobApplication["status"];
  dateApplied: string;
  source: string;
  contactName: string;
  contactEmail: string;
  jobUrl: string;
  notes: string;
  tags: string;
};

const workModeLabels: Record<string, string> = {
  REMOTE: "Remote",
  HYBRID: "Hybrid",
  ON_SITE: "On-site",
};

const jobTypeLabels: Record<string, string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACT: "Contract",
  INTERNSHIP: "Internship",
};

const defaultValues: FormData = {
  company: "",
  title: "",
  location: "",
  workMode: "",
  jobType: "",
  salaryMin: "",
  salaryMax: "",
  currency: "USD",
  status: "SAVED",
  dateApplied: "",
  source: "",
  contactName: "",
  contactEmail: "",
  jobUrl: "",
  notes: "",
  tags: "",
};

function applicationToFormData(app: JobApplication): FormData {
  return {
    company: app.company,
    title: app.title,
    location: app.location || "",
    workMode: app.workMode || "",
    jobType: app.jobType || "",
    salaryMin: app.salaryMin != null ? String(app.salaryMin) : "",
    salaryMax: app.salaryMax != null ? String(app.salaryMax) : "",
    currency: app.currency || "USD",
    status: app.status,
    dateApplied: app.dateApplied || "",
    source: app.source || "",
    contactName: app.contactName || "",
    contactEmail: app.contactEmail || "",
    jobUrl: app.jobUrl || "",
    notes: app.notes || "",
    tags: app.tags?.join(", ") || "",
  };
}

function formDataToInput(data: FormData): Omit<JobApplication, "id" | "interviews" | "createdAt" | "updatedAt"> {
  return {
    company: data.company,
    title: data.title,
    location: data.location || "",
    workMode: (data.workMode as JobApplication["workMode"]) || "REMOTE",
    jobType: (data.jobType as JobApplication["jobType"]) || "FULL_TIME",
    salaryMin: data.salaryMin ? Number(data.salaryMin) : undefined,
    salaryMax: data.salaryMax ? Number(data.salaryMax) : undefined,
    currency: data.currency || "USD",
    status: data.status,
    dateApplied: data.dateApplied || "",
    source: data.source || "",
    contactName: data.contactName || undefined,
    contactEmail: data.contactEmail || undefined,
    jobUrl: data.jobUrl || undefined,
    notes: data.notes || undefined,
    tags: data.tags
      ? data.tags.split(",").map((t) => t.trim()).filter(Boolean)
      : [],
  };
}

export function JobApplicationForm({
  initialData,
  onSubmit,
  onCancel,
}: {
  initialData?: JobApplication;
  onSubmit: (data: Omit<JobApplication, "id" | "interviews" | "createdAt" | "updatedAt">) => Promise<void>;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<FormData>(
    initialData ? applicationToFormData(initialData) : defaultValues,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateField<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.company.trim() || !form.title.trim()) return;

    setLoading(true);
    setError(null);
    try {
      await onSubmit(formDataToInput(form));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <FieldGroup>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="company">Company *</FieldLabel>
            <Input
              id="company"
              placeholder="e.g. Acme Corp"
              required
              value={form.company}
              onChange={(e) => updateField("company", e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="title">Job Title *</FieldLabel>
            <Input
              id="title"
              placeholder="e.g. Frontend Developer"
              required
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="location">Location</FieldLabel>
            <Input
              id="location"
              placeholder="e.g. San Francisco, CA"
              value={form.location}
              onChange={(e) => updateField("location", e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel>Work Mode</FieldLabel>
            <Select
              value={form.workMode}
              onValueChange={(val) => updateField("workMode", val as FormData["workMode"])}
            >
              <SelectTrigger className="w-full">
                <SelectValue>
                  {workModeLabels[form.workMode] || "Select work mode"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="REMOTE">Remote</SelectItem>
                <SelectItem value="HYBRID">Hybrid</SelectItem>
                <SelectItem value="ON_SITE">On-site</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field>
            <FieldLabel>Job Type</FieldLabel>
            <Select
              value={form.jobType}
              onValueChange={(val) => updateField("jobType", val as FormData["jobType"])}
            >
              <SelectTrigger className="w-full">
                <SelectValue>
                  {jobTypeLabels[form.jobType] || "Select job type"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FULL_TIME">Full-time</SelectItem>
                <SelectItem value="PART_TIME">Part-time</SelectItem>
                <SelectItem value="CONTRACT">Contract</SelectItem>
                <SelectItem value="INTERNSHIP">Internship</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel>Status</FieldLabel>
            <Select
              value={form.status}
              onValueChange={(val) => updateField("status", val as FormData["status"])}
            >
              <SelectTrigger className="w-full">
                <SelectValue>
                  {statusConfig[form.status]?.label ?? "Select status"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SAVED">Saved</SelectItem>
                <SelectItem value="APPLIED">Applied</SelectItem>
                <SelectItem value="PHONE_SCREEN">Phone Screen</SelectItem>
                <SelectItem value="INTERVIEWING">Interviewing</SelectItem>
                <SelectItem value="ASSESSMENT">Assessment</SelectItem>
                <SelectItem value="FINAL_ROUND">Final Round</SelectItem>
                <SelectItem value="OFFER">Offer</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
                <SelectItem value="WITHDRAWN">Withdrawn</SelectItem>
                <SelectItem value="DECLINED">Declined</SelectItem>
                <SelectItem value="ACCEPTED">Accepted</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field>
            <FieldLabel htmlFor="salaryMin">Salary Min</FieldLabel>
            <Input
              id="salaryMin"
              type="number"
              placeholder="e.g. 80000"
              value={form.salaryMin}
              onChange={(e) => updateField("salaryMin", e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="salaryMax">Salary Max</FieldLabel>
            <Input
              id="salaryMax"
              type="number"
              placeholder="e.g. 120000"
              value={form.salaryMax}
              onChange={(e) => updateField("salaryMax", e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="currency">Currency</FieldLabel>
            <Input
              id="currency"
              placeholder="USD"
              maxLength={3}
              value={form.currency}
              onChange={(e) => updateField("currency", e.target.value.toUpperCase())}
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="dateApplied">Date Applied</FieldLabel>
            <Input
              id="dateApplied"
              type="date"
              value={form.dateApplied}
              onChange={(e) => updateField("dateApplied", e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="source">Source</FieldLabel>
            <Input
              id="source"
              placeholder="e.g. LinkedIn, referral"
              value={form.source}
              onChange={(e) => updateField("source", e.target.value)}
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="contactName">Contact Name</FieldLabel>
            <Input
              id="contactName"
              placeholder="e.g. Jane Smith"
              value={form.contactName}
              onChange={(e) => updateField("contactName", e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="contactEmail">Contact Email</FieldLabel>
            <Input
              id="contactEmail"
              type="email"
              placeholder="e.g. jane@company.com"
              value={form.contactEmail}
              onChange={(e) => updateField("contactEmail", e.target.value)}
            />
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="jobUrl">Job URL</FieldLabel>
          <Input
            id="jobUrl"
            type="url"
            placeholder="https://..."
            value={form.jobUrl}
            onChange={(e) => updateField("jobUrl", e.target.value)}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="tags">Tags</FieldLabel>
          <Input
            id="tags"
            placeholder="Comma-separated, e.g. react, remote-only"
            value={form.tags}
            onChange={(e) => updateField("tags", e.target.value)}
          />
          <FieldDescription>Separate tags with commas</FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="notes">Notes</FieldLabel>
          <Textarea
            id="notes"
            placeholder="Any additional notes..."
            rows={3}
            value={form.notes}
            onChange={(e) => updateField("notes", e.target.value)}
          />
        </Field>

        {error && (
          <Field>
            <p className="text-sm text-destructive">{error}</p>
          </Field>
        )}

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading || !form.company.trim() || !form.title.trim()}>
            {loading ? <Loader2Icon className="animate-spin" /> : initialData ? "Save Changes" : "Create Application"}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
