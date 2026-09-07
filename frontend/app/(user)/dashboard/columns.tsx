"use client";

import type { JobApplication } from "@/lib/types";
import { StatusBadge } from "@/components/reusables/status-badge";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import type { Column } from "@/components/reusables/data-table";
import { interviewTypeLabels } from "@/lib/enum-labels";

function formatDate(dateString: string): string {
  if (!dateString) return "Not applied";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function getLatestInterviewStatus(interviews: JobApplication["interviews"]): {
  label: string;
  className: string;
} {
  if (interviews.length === 0) {
    return { label: "No interviews", className: "border-gray-300 text-gray-600 dark:border-gray-600 dark:text-gray-400" };
  }

  const sorted = [...interviews].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const nextScheduled = sorted.find((i) => i.status === "SCHEDULED");
  if (nextScheduled) {
    return {
      label: interviewTypeLabels[nextScheduled.type],
      className: "border-blue-300 text-blue-600 dark:border-blue-600 dark:text-blue-400",
    };
  }

  const latest = sorted[0];
  if (latest.status === "COMPLETED") {
    if (latest.outcome === "PASSED") {
      return {
        label: interviewTypeLabels[latest.type],
        className: "border-green-300 text-green-600 dark:border-green-600 dark:text-green-400",
      };
    }
    if (latest.outcome === "FAILED") {
      return {
        label: interviewTypeLabels[latest.type],
        className: "border-red-300 text-red-600 dark:border-red-600 dark:text-red-400",
      };
    }
    return {
      label: interviewTypeLabels[latest.type],
      className: "border-amber-300 text-amber-600 dark:border-amber-600 dark:text-amber-400",
    };
  }

  return {
    label: interviewTypeLabels[latest.type],
    className: "border-gray-300 text-gray-600 dark:border-gray-600 dark:text-gray-400",
  };
}

export function columns({
  onEdit,
  onDelete,
}: {
  onEdit: (app: JobApplication) => void;
  onDelete: (app: JobApplication) => void;
}): Column<JobApplication>[] {
  return [
    {
      id: "company",
      header: "Company",
      accessorKey: "company",
      sortable: true,
      cell: (row) => (
        <span className="font-semibold">{row.company}</span>
      ),
    },
    {
      id: "title",
      header: "Title",
      accessorKey: "title",
      sortable: true,
      cell: (row) => (
        <span className="text-muted-foreground">{row.title}</span>
      ),
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      sortable: true,
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      id: "interviewStatus",
      header: "Interview",
      accessorKey: "interviews",
      sortable: false,
      cell: (row) => {
        const interviewStatus = getLatestInterviewStatus(row.interviews);
        return (
          <Badge variant="outline" className={interviewStatus.className}>
            {interviewStatus.label}
          </Badge>
        );
      },
    },
    {
      id: "dateApplied",
      header: "Date Applied",
      accessorKey: "dateApplied",
      sortable: true,
      cell: (row) => (
        <span
          className={
            row.dateApplied ? "" : "text-muted-foreground italic"
          }
        >
          {formatDate(row.dateApplied)}
        </span>
      ),
    },
    {
      id: "location",
      header: "Location",
      accessorKey: "location",
      sortable: true,
    },
    {
      id: "actions",
      header: "",
      hideFromColumnToggle: true,
      cell: (row) => {
        return (
          <div onClick={(e) => e.stopPropagation()}>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="ghost" size="icon-sm" />
                }
              >
                <MoreHorizontal className="size-4" />
                <span className="sr-only">Actions</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(row)}>
                  <Pencil className="size-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => onDelete(row)}
                >
                  <Trash2 className="size-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
}
