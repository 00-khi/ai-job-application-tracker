import type {
  ApplicationStatus,
  WorkMode,
  JobType,
  Interview,
} from "@/lib/types";

// ── Label Maps ────────────────────────────────────────────────────────────────

export const applicationStatusLabels: Record<ApplicationStatus, string> = {
  SAVED: "Saved",
  APPLIED: "Applied",
  PHONE_SCREEN: "Phone Screen",
  INTERVIEWING: "Interviewing",
  ASSESSMENT: "Assessment",
  FINAL_ROUND: "Final Round",
  OFFER: "Offer",
  REJECTED: "Rejected",
  WITHDRAWN: "Withdrawn",
  DECLINED: "Declined",
  ACCEPTED: "Accepted",
};

export const applicationStatusConfig: Record<
  ApplicationStatus,
  { label: string; className: string }
> = {
  SAVED: {
    label: "Saved",
    className:
      "border-gray-300 text-gray-600 dark:border-gray-600 dark:text-gray-400",
  },
  APPLIED: {
    label: "Applied",
    className:
      "border-blue-300 text-blue-600 dark:border-blue-600 dark:text-blue-400",
  },
  PHONE_SCREEN: {
    label: "Phone Screen",
    className:
      "border-blue-300 text-blue-600 dark:border-blue-600 dark:text-blue-400",
  },
  INTERVIEWING: {
    label: "Interviewing",
    className:
      "border-blue-300 text-blue-600 dark:border-blue-600 dark:text-blue-400",
  },
  ASSESSMENT: {
    label: "Assessment",
    className:
      "border-amber-300 text-amber-600 dark:border-amber-600 dark:text-amber-400",
  },
  FINAL_ROUND: {
    label: "Final Round",
    className:
      "border-violet-300 text-violet-600 dark:border-violet-600 dark:text-violet-400",
  },
  OFFER: {
    label: "Offer",
    className:
      "border-green-300 text-green-600 dark:border-green-600 dark:text-green-400",
  },
  ACCEPTED: {
    label: "Accepted",
    className:
      "border-green-300 text-green-600 dark:border-green-600 dark:text-green-400",
  },
  REJECTED: {
    label: "Rejected",
    className:
      "border-red-300 text-red-600 dark:border-red-600 dark:text-red-400",
  },
  WITHDRAWN: {
    label: "Withdrawn",
    className:
      "border-gray-300 text-gray-600 dark:border-gray-600 dark:text-gray-400",
  },
  DECLINED: {
    label: "Declined",
    className:
      "border-gray-300 text-gray-600 dark:border-gray-600 dark:text-gray-400",
  },
};

export const workModeLabels: Record<WorkMode, string> = {
  REMOTE: "Remote",
  HYBRID: "Hybrid",
  ON_SITE: "On-site",
};

export const jobTypeLabels: Record<JobType, string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACT: "Contract",
  INTERNSHIP: "Internship",
};

export const interviewTypeLabels: Record<Interview["type"], string> = {
  PHONE_SCREEN: "Phone Screen",
  TECHNICAL: "Technical",
  BEHAVIORAL: "Behavioral",
  FINAL_ROUND: "Final Round",
  PANEL: "Panel",
  OTHER: "Other",
};

export const interviewStatusLabels: Record<Interview["status"], string> = {
  SCHEDULED: "Scheduled",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

export const interviewOutcomeLabels: Record<
  NonNullable<Interview["outcome"]>,
  string
> = {
  PASSED: "Passed",
  FAILED: "Failed",
  PENDING: "Pending",
  NO_RESPONSE: "No Response",
};

// ── Currency Options ──────────────────────────────────────────────────────────

export const currencies: { code: string; label: string }[] = [
  { code: "USD", label: "USD" },
  { code: "EUR", label: "EUR" },
  { code: "GBP", label: "GBP" },
  { code: "JPY", label: "JPY" },
  { code: "CAD", label: "CAD" },
  { code: "AUD", label: "AUD" },
  { code: "PHP", label: "PHP" },
  { code: "SGD", label: "SGD" },
  { code: "HKD", label: "HKD" },
  { code: "TWD", label: "TWD" },
  { code: "KRW", label: "KRW" },
  { code: "INR", label: "INR" },
  { code: "MYR", label: "MYR" },
  { code: "IDR", label: "IDR" },
  { code: "THB", label: "THB" },
  { code: "CHF", label: "CHF" },
  { code: "CNY", label: "CNY" },
  { code: "BRL", label: "BRL" },
  { code: "MXN", label: "MXN" },
  { code: "NZD", label: "NZD" },
];

// ── Generic Formatter ─────────────────────────────────────────────────────────

const specialCases: Record<string, string> = {
  ON_SITE: "On-site",
};

export function formatEnum(value: string): string {
  if (specialCases[value]) return specialCases[value];

  return value
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
