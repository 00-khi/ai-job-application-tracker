"use client";

import { type ColumnDef, type StockFeatures } from "@tanstack/react-table";
import type { JobApplication } from "@/data/mock-data";
import { StatusBadge } from "@/components/reusables/status-badge";

function formatDate(dateString: string): string {
  if (!dateString) return "Not applied";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

export const columns: ColumnDef<StockFeatures, JobApplication>[] = [
  {
    accessorKey: "company",
    header: "Company",
    cell: ({ row }) => (
      <span className="font-semibold">{row.original.company}</span>
    ),
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.title}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "dateApplied",
    header: "Date Applied",
    cell: ({ row }) => (
      <span
        className={
          row.original.dateApplied ? "" : "text-muted-foreground italic"
        }
      >
        {formatDate(row.original.dateApplied)}
      </span>
    ),
  },
  {
    accessorKey: "location",
    header: "Location",
  },
];
