"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CreateInterviewInput } from "@/lib/job-applications";

type InterviewType = CreateInterviewInput["type"];
type InterviewStatus = CreateInterviewInput["status"];
type InterviewOutcome = NonNullable<CreateInterviewInput["outcome"]>;

interface InterviewFormProps {
  initialData?: Partial<CreateInterviewInput>;
  onSubmit: (data: CreateInterviewInput) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
}

const interviewTypeLabels: Record<string, string> = {
  PHONE_SCREEN: "Phone Screen",
  TECHNICAL: "Technical",
  BEHAVIORAL: "Behavioral",
  FINAL_ROUND: "Final Round",
  PANEL: "Panel",
  OTHER: "Other",
};

const interviewStatusLabels: Record<string, string> = {
  SCHEDULED: "Scheduled",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

const interviewOutcomeLabels: Record<string, string> = {
  PASSED: "Passed",
  FAILED: "Failed",
  PENDING: "Pending",
  NO_RESPONSE: "No Response",
};

export function InterviewForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = "Save",
}: InterviewFormProps) {
  const [type, setType] = useState<InterviewType>(initialData?.type || "PHONE_SCREEN");
  const [date, setDate] = useState(initialData?.date || new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState(initialData?.time || "");
  const [interviewer, setInterviewer] = useState(initialData?.interviewer || "");
  const [status, setStatus] = useState<InterviewStatus>(initialData?.status || "SCHEDULED");
  const [outcome, setOutcome] = useState<InterviewOutcome | undefined>(initialData?.outcome);
  const [notes, setNotes] = useState(initialData?.notes || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({
        type,
        date,
        time: time || undefined,
        interviewer: interviewer || undefined,
        status,
        outcome,
        notes: notes || undefined,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="interview-type">Type</Label>
          <Select value={type} onValueChange={(v) => setType(v as InterviewType)}>
            <SelectTrigger id="interview-type">
              <SelectValue>
                {interviewTypeLabels[type] || "Select type"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {Object.entries(interviewTypeLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="interview-status">Status</Label>
          <Select value={status} onValueChange={(v) => setStatus(v as InterviewStatus)}>
            <SelectTrigger id="interview-status">
              <SelectValue>
                {interviewStatusLabels[status] || "Select status"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {Object.entries(interviewStatusLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="interview-date">Date</Label>
          <Input
            id="interview-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="interview-time">Time (optional)</Label>
          <Input
            id="interview-time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="interviewer">Interviewer (optional)</Label>
        <Input
          id="interviewer"
          value={interviewer}
          onChange={(e) => setInterviewer(e.target.value)}
          placeholder="e.g. John Smith (Engineering Manager)"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="interview-outcome">Outcome (optional)</Label>
        <Select
          value={outcome || ""}
          onValueChange={(v) => setOutcome(v ? (v as InterviewOutcome) : undefined)}
        >
          <SelectTrigger id="interview-outcome">
            <SelectValue placeholder="Select outcome">
              {outcome ? interviewOutcomeLabels[outcome] : "Select outcome"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">None</SelectItem>
            {Object.entries(interviewOutcomeLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="interview-notes">Notes (optional)</Label>
        <Textarea
          id="interview-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any notes about this interview..."
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
