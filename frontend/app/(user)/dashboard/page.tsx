"use client"

import { useState } from "react"
import { PageHeader } from "@/components/reusables/page-header"
import { StatCard } from "@/components/reusables/stat-card"
import { DataTable } from "@/components/reusables/data-table"
import { ApplicationDetailDialog } from "@/components/reusables/application-detail-dialog"
import { CreateApplicationDialog } from "@/components/job-application/create-application-dialog"
import { EditApplicationDialog } from "@/components/job-application/edit-application-dialog"
import { DeleteApplicationDialog } from "@/components/job-application/delete-application-dialog"
import { BackendTimeoutCard } from "@/components/reusables/backend-timeout-card"
import { usePaginatedApplications } from "@/hooks/usePaginatedApplications"
import type { JobApplication } from "@/lib/types"
import { columns } from "./columns"
import { Briefcase, Calendar, Trophy, XCircle, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DashboardSkeleton } from "@/components/reusables/dashboard-skeleton"

export default function DashboardPage() {
  const {
    data,
    stats,
    loading,
    error,
    isTimeout,
    search,
    status,
    page,
    pageSize,
    sortBy,
    sortDirection,
    handleSearch,
    handleStatusChange,
    handlePageChange,
    handlePageSizeChange,
    handleSort,
    refetch,
    retry,
    create,
    update,
    remove,
  } = usePaginatedApplications()

  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null)
  const selectedApplication = data.content.find(app => app.id === selectedApplicationId) ?? null
  const [detailOpen, setDetailOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [editApplication, setEditApplication] = useState<JobApplication | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteApplication, setDeleteApplication] = useState<JobApplication | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)

  function handleRowClick(application: JobApplication) {
    setSelectedApplicationId(application.id)
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

  if (loading && data.content.length === 0) {
    return <DashboardSkeleton />
  }

  if (isTimeout) {
    return (
      <div className="space-y-6">
        <PageHeader title="Dashboard" description="Track and manage your job applications" />
        <div className="flex items-center justify-center py-12">
          <BackendTimeoutCard onRetry={retry} />
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
        <StatCard
          label="Applications"
          value={String(stats?.total ?? 0)}
          hint="Total tracked"
          icon={Briefcase}
        />
        <StatCard
          label="Interviews"
          value={String(stats?.totalInterviews ?? 0)}
          hint="Across all apps"
          icon={Calendar}
        />
        <StatCard
          label="Offers"
          value={String(stats?.offers ?? 0)}
          hint="Pending decisions"
          icon={Trophy}
        />
        <StatCard
          label="Rejected"
          value={String(stats?.rejected ?? 0)}
          hint="Did not advance"
          icon={XCircle}
        />
      </div>

      <DataTable
        columns={columns({ onEdit: handleEdit, onDelete: handleDelete })}
        data={data.content}
        onRowClick={handleRowClick}
        search={search}
        onSearchChange={handleSearch}
        statusFilter={status}
        onStatusFilterChange={handleStatusChange}
        pagination={{
          page: data.page,
          pageSize: data.size,
          totalElements: data.totalElements,
          totalPages: data.totalPages,
          hasNext: data.hasNext,
          hasPrevious: data.hasPrevious,
        }}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        sorting={{ sortBy, sortDirection }}
        onSortingChange={handleSort}
      />

      <ApplicationDetailDialog
        application={selectedApplication}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onInterviewsChanged={refetch}
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
