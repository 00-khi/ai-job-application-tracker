"use client"

import { useState } from "react"
import { PageHeader } from "@/components/reusables/page-header"
import { StatCard } from "@/components/reusables/stat-card"
import { DataTable } from "@/components/reusables/data-table"
import { ApplicationDetailDialog } from "@/components/reusables/application-detail-dialog"
import { useApplicationStats } from "@/hooks/useApplicationStats"
import { mockJobApplications, type JobApplication } from "@/data/mock-data"
import { columns } from "./columns"
import { Briefcase, Calendar, Trophy, XCircle } from "lucide-react"

export default function DashboardPage() {
  const stats = useApplicationStats()
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  function handleRowClick(application: JobApplication) {
    setSelectedApplication(application)
    setDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Track and manage your job applications"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Applications" value={String(stats.total)} hint="Total tracked" icon={Briefcase} />
        <StatCard label="Interviews" value={String(stats.totalInterviews)} hint="Across all apps" icon={Calendar} />
        <StatCard label="Offers" value={String(stats.offers)} hint="Pending decisions" icon={Trophy} />
        <StatCard label="Rejected" value={String(stats.rejected)} hint="Did not advance" icon={XCircle} />
      </div>

      <DataTable
        columns={columns}
        data={mockJobApplications}
        onRowClick={handleRowClick}
      />

      <ApplicationDetailDialog
        application={selectedApplication}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  )
}
