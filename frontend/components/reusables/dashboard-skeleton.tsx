import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

function StatCardSkeleton() {
  return (
    <Card data-slot="stat-card-skeleton" className="p-5">
      <div className="flex items-start justify-between">
        <div className="min-w-0 space-y-2.5">
          <Skeleton className="h-3 w-16 rounded-md" />
          <Skeleton className="h-7 w-12 rounded-lg" />
          <Skeleton className="h-2.5 w-20 rounded-md" />
        </div>
        <Skeleton className="h-9 w-9 shrink-0 rounded-xl" />
      </div>
    </Card>
  )
}

function TableRowSkeleton({ widths }: { widths: string[] }) {
  return (
    <tr className="border-b transition-colors">
      {widths.map((w, i) => (
        <td key={i} className="p-4 align-middle">
          <Skeleton className={`h-4 ${w} rounded-md`} />
        </td>
      ))}
    </tr>
  )
}

export function DashboardSkeleton() {
  const rowWidths = [
    ["w-24", "w-20", "w-16", "w-20", "w-16", "w-8"],
    ["w-28", "w-24", "w-14", "w-22", "w-18", "w-8"],
    ["w-20", "w-16", "w-18", "w-16", "w-14", "w-8"],
    ["w-26", "w-22", "w-14", "w-20", "w-16", "w-8"],
    ["w-22", "w-18", "w-16", "w-18", "w-20", "w-8"],
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <header className="gap-4 flex flex-wrap items-center justify-between">
        <div className="min-w-0 space-y-1.5">
          <Skeleton className="h-7 w-48 rounded-lg" />
          <Skeleton className="h-4 w-72 rounded-md" />
        </div>
        <Skeleton className="h-9 w-36 rounded-lg" />
      </header>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>

      {/* Data Table */}
      <div className="space-y-4">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Skeleton className="h-9 w-full max-w-sm rounded-lg" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-[160px] rounded-lg" />
            <Skeleton className="h-9 w-28 rounded-lg" />
          </div>
        </div>

        {/* Table */}
        <div className="rounded-2xl border overflow-hidden">
          <table className="w-full caption-bottom text-sm">
            <thead className="border-b">
              <tr>
                {["w-20", "w-16", "w-16", "w-24", "w-18", "w-8"].map((w, i) => (
                  <th key={i} className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">
                    <Skeleton className={`h-4 ${w} rounded-md`} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rowWidths.map((widths, i) => (
                <TableRowSkeleton key={i} widths={widths} />
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-wrap gap-y-4 gap-x-2 items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-24 rounded-md" />
            <Skeleton className="h-8 w-14 rounded-lg" />
            <Skeleton className="h-4 w-20 rounded-md" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-4 w-28 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  )
}
