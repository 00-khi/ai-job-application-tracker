"use client";

import { type ColumnDef, type StockFeatures } from "@tanstack/react-table";
import type { JobApplication } from "@/data/mock-data";
import { StatusBadge } from "@/components/reusables/status-badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

function formatDate(dateString: string): string {
  if (!dateString) return "Not applied";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

export function columns({
  onEdit,
  onDelete,
}: {
  onEdit: (app: JobApplication) => void;
  onDelete: (app: JobApplication) => void;
}): ColumnDef<StockFeatures, JobApplication>[] {
  return [
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
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const app = row.original;
        return (
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
              <DropdownMenuItem onClick={() => onEdit(app)}>
                <Pencil className="size-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onClick={() => onDelete(app)}
              >
                <Trash2 className="size-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
