"use client"

import { useState } from "react"
import { PageHeader } from "@/components/reusables/page-header"
import { StatCard } from "@/components/reusables/stat-card"
import { DataTable } from "@/components/reusables/data-table"
import { ApplicationDetailDialog } from "@/components/reusables/application-detail-dialog"
import { CreateApplicationDialog } from "@/components/job-application/create-application-dialog"
import { EditApplicationDialog } from "@/components/job-application/edit-application-dialog"
import { DeleteApplicationDialog } from "@/components/job-application/delete-application-dialog"
import { useJobApplications } from "@/hooks/useJobApplications"
import type { JobApplication } from "@/data/mock-data"
import { columns } from "./columns"
import { Briefcase, Calendar, Trophy, XCircle, Plus, Loader2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  const { applications, loading, error, create, update, remove } = useJobApplications()
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [editApplication, setEditApplication] = useState<JobApplication | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteApplication, setDeleteApplication] = useState<JobApplication | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const stats = {
    total: applications.length,
    totalInterviews: applications.reduce((sum, app) => sum + app.interviews.length, 0),
    offers: applications.filter((app) => app.status === "OFFER").length,
    rejected: applications.filter((app) => app.status === "REJECTED").length,
  }

  function handleRowClick(application: JobApplication) {
    setSelectedApplication(application)
    setDetailOpen(true)
  }

  function handleEdit(application: JobApplication) {
    setEditApplication(application)
    setEditOpen(true)
  }

  function handleDelete(application: JobApplication) {
    setDeleteApplication(application)
    setDeleteOpen(true)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Dashboard" description="Track and manage your job applications" />
        <div className="flex items-center justify-center py-12">
          <Loader2Icon className="size-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Dashboard" description="Track and manage your job applications" />
        <div className="flex items-center justify-center py-12">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Track and manage your job applications"
        actions={
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="size-4" />
            Add Application
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Applications" value={String(stats.total)} hint="Total tracked" icon={Briefcase} />
        <StatCard label="Interviews" value={String(stats.totalInterviews)} hint="Across all apps" icon={Calendar} />
        <StatCard label="Offers" value={String(stats.offers)} hint="Pending decisions" icon={Trophy} />
        <StatCard label="Rejected" value={String(stats.rejected)} hint="Did not advance" icon={XCircle} />
      </div>

      <DataTable
        columns={columns({ onEdit: handleEdit, onDelete: handleDelete })}
        data={applications}
        onRowClick={handleRowClick}
      />

      <ApplicationDetailDialog
        application={selectedApplication}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <CreateApplicationDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreate={create}
      />

      <EditApplicationDialog
        application={editApplication}
        open={editOpen}
        onOpenChange={setEditOpen}
        onUpdate={update}
      />

      <DeleteApplicationDialog
        application={deleteApplication}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onDelete={remove}
      />
    </div>
  )
}
