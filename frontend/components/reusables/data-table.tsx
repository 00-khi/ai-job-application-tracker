"use client";

import * as React from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ApplicationStatus } from "@/data/mock-data";
import { statusConfig } from "@/components/reusables/status-badge";

interface ServerPagination {
  page: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

interface ServerSorting {
  sortBy: string;
  sortDirection: "asc" | "desc";
}

interface Column<T> {
  id: string;
  header: string;
  accessorKey?: string;
  sortable?: boolean;
  cell?: (row: T) => React.ReactNode;
  hide?: boolean;
  hideFromColumnToggle?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  search?: string;
  onSearchChange?: (value: string) => void;
  statusFilter?: string;
  onStatusFilterChange?: (value: string | undefined) => void;
  pagination?: ServerPagination;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  sorting?: ServerSorting;
  onSortingChange?: (column: string, direction: "asc" | "desc") => void;
}

function DataTable<T>({
  columns,
  data,
  onRowClick,
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  pagination,
  onPageChange,
  onPageSizeChange,
  sorting,
  onSortingChange,
}: DataTableProps<T>) {
  const [hiddenColumns, setHiddenColumns] = React.useState<Set<string>>(new Set());

  const visibleColumns = columns.filter((col) => !col.hide && !hiddenColumns.has(col.id));

  const handleSort = (columnId: string) => {
    if (!onSortingChange || !sorting) return;

    const currentDirection = sorting.sortBy === columnId ? sorting.sortDirection : undefined;
    const newDirection: "asc" | "desc" = currentDirection === "asc" ? "desc" : "asc";
    onSortingChange(columnId, newDirection);
  };

  const getSortIndicator = (columnId: string) => {
    if (!sorting || sorting.sortBy !== columnId) return null;
    return sorting.sortDirection === "asc" ? (
      <ChevronUp className="size-4" />
    ) : (
      <ChevronDown className="size-4" />
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-50 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={search ?? ""}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={statusFilter ?? "all"}
            onValueChange={(value) => onStatusFilterChange?.(value!)}
          >
            <SelectTrigger className="w-[160px]" size="sm">
              <SelectValue>
                {(() => {
                  if (!statusFilter || statusFilter === "all") return "All Statuses";
                  return (
                    statusConfig[statusFilter as ApplicationStatus]?.label ?? statusFilter
                  );
                })()}
              </SelectValue>
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>

              {(
                Object.entries(statusConfig) as [
                  ApplicationStatus,
                  { label: string; className: string },
                ][]
              ).map(([value, { label }]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="outline" size="sm" />}
            >
              <SlidersHorizontal className="mr-2 size-4" />
              Columns
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {columns
                  .filter((col) => !col.hide && !col.hideFromColumnToggle)
                  .map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      checked={!hiddenColumns.has(column.id)}
                      onCheckedChange={(checked) => {
                        setHiddenColumns((prev) => {
                          const next = new Set(prev);
                          if (checked) {
                            next.delete(column.id);
                          } else {
                            next.add(column.id);
                          }
                          return next;
                        });
                      }}
                    >
                      {column.header}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="rounded-2xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {visibleColumns.map((column) => (
                <TableHead
                  key={column.id}
                  className={cn(
                    column.sortable && "cursor-pointer select-none hover:text-foreground",
                  )}
                  onClick={column.sortable ? () => handleSort(column.id) : undefined}
                >
                  <div className="flex items-center gap-2">
                    {column.header}
                    {column.sortable && (
                      <span className="text-muted-foreground">
                        {getSortIndicator(column.id) ?? (
                          <span className="opacity-30">
                            <ChevronUp className="size-4" />
                          </span>
                        )}
                      </span>
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length ? (
              data.map((row, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  className={cn(onRowClick && "cursor-pointer")}
                  onClick={() => onRowClick?.(row)}
                >
                  {visibleColumns.map((column) => (
                    <TableCell key={column.id}>
                      {column.cell
                        ? column.cell(row)
                        : column.accessorKey
                          ? String((row as Record<string, unknown>)[column.accessorKey] ?? "")
                          : null}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={visibleColumns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-wrap gap-y-4 gap-x-2 items-center justify-between px-2">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm text-muted-foreground">Rows per page:</p>
          <Select
            value={String(pagination?.pageSize ?? 10)}
            onValueChange={(value) => onPageSizeChange?.(Number(value))}
          >
            <SelectTrigger size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            {pagination?.totalElements ?? 0} item(s)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => onPageChange?.((pagination?.page ?? 0) - 1)}
            disabled={!pagination?.hasPrevious}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {(pagination?.page ?? 0) + 1} of{" "}
            {pagination?.totalPages ?? 1}
          </span>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => onPageChange?.((pagination?.page ?? 0) + 1)}
            disabled={!pagination?.hasNext}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export { DataTable, type DataTableProps, type ServerPagination, type ServerSorting, type Column };
