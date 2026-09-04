"use client";

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
import type { Column } from "@/components/reusables/data-table";

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
