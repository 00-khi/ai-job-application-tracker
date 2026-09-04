import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ApplicationStatus } from "@/data/mock-data";

const statusConfig: Record<
  ApplicationStatus,
  { label: string; className: string }
> = {
  SAVED: {
    label: "Saved",
    className: "border-gray-300 text-gray-600 dark:border-gray-600 dark:text-gray-400",
  },
  APPLIED: {
    label: "Applied",
    className: "border-blue-300 text-blue-600 dark:border-blue-600 dark:text-blue-400",
  },
  PHONE_SCREEN: {
    label: "Phone Screen",
    className: "border-blue-300 text-blue-600 dark:border-blue-600 dark:text-blue-400",
  },
  INTERVIEWING: {
    label: "Interviewing",
    className: "border-blue-300 text-blue-600 dark:border-blue-600 dark:text-blue-400",
  },
  ASSESSMENT: {
    label: "Assessment",
    className: "border-amber-300 text-amber-600 dark:border-amber-600 dark:text-amber-400",
  },
  FINAL_ROUND: {
    label: "Final Round",
    className: "border-violet-300 text-violet-600 dark:border-violet-600 dark:text-violet-400",
  },
  OFFER: {
    label: "Offer",
    className: "border-green-300 text-green-600 dark:border-green-600 dark:text-green-400",
  },
  ACCEPTED: {
    label: "Accepted",
    className: "border-green-300 text-green-600 dark:border-green-600 dark:text-green-400",
  },
  REJECTED: {
    label: "Rejected",
    className: "border-red-300 text-red-600 dark:border-red-600 dark:text-red-400",
  },
  WITHDRAWN: {
    label: "Withdrawn",
    className: "border-gray-300 text-gray-600 dark:border-gray-600 dark:text-gray-400",
  },
  DECLINED: {
    label: "Declined",
    className: "border-gray-300 text-gray-600 dark:border-gray-600 dark:text-gray-400",
  },
};

function StatusBadge({
  status,
  className,
}: {
  status: ApplicationStatus;
  className?: string;
}) {
  const config = statusConfig[status];

  return (
    <Badge variant="outline" className={cn(config.className, className)}>
      {config.label}
    </Badge>
  );
}

export { StatusBadge, statusConfig };
