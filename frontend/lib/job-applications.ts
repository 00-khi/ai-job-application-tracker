import { apiFetch } from "@/lib/api";
import type { JobApplication } from "@/lib/types";
import type { PaginatedResponse, SearchParams, ApplicationStats } from "@/lib/types";

export type { JobApplication };

export type CreateApplicationInput = Omit<
  JobApplication,
  "id" | "interviews" | "createdAt" | "updatedAt"
>;

export type UpdateApplicationInput = CreateApplicationInput;

function mapApplicationToBackend(input: CreateApplicationInput): Record<string, unknown> {
  return {
    company: input.company,
    title: input.title,
    location: input.location || null,
    workMode: input.workMode || null,
    jobType: input.jobType || null,
    salaryMin: input.salaryMin ?? null,
    salaryMax: input.salaryMax ?? null,
    currency: input.currency || "USD",
    status: input.status || "SAVED",
    dateApplied: input.dateApplied || null,
    source: input.source || null,
    contactName: input.contactName || null,
    contactEmail: input.contactEmail || null,
    jobUrl: input.jobUrl || null,
    notes: input.notes || null,
    tags: input.tags || [],
  };
}

function mapApplicationFromBackend(data: Record<string, unknown>): JobApplication {
  return {
    id: String(data.id),
    company: data.company as string,
    title: data.title as string,
    location: (data.location as string) || "",
    workMode: (data.workMode as JobApplication["workMode"]) || "REMOTE",
    jobType: (data.jobType as JobApplication["jobType"]) || "FULL_TIME",
    salaryMin: (data.salaryMin as number) || undefined,
    salaryMax: (data.salaryMax as number) || undefined,
    currency: (data.currency as string) || "USD",
    status: (data.status as JobApplication["status"]) || "SAVED",
    dateApplied: (data.dateApplied as string) || "",
    source: (data.source as string) || "",
    contactName: (data.contactName as string) || undefined,
    contactEmail: (data.contactEmail as string) || undefined,
    jobUrl: (data.jobUrl as string) || undefined,
    notes: (data.notes as string) || undefined,
    tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
    interviews: Array.isArray(data.interviews)
      ? (data.interviews as Record<string, unknown>[]).map((int) => ({
          id: String(int.id),
          type: (int.type as JobApplication["interviews"][number]["type"]) || "OTHER",
          date: int.date as string,
          time: (int.time as string) || undefined,
          interviewer: (int.interviewer as string) || undefined,
          status: (int.status as JobApplication["interviews"][number]["status"]) || "SCHEDULED",
          outcome: (int.outcome as JobApplication["interviews"][number]["outcome"]) || undefined,
          notes: (int.notes as string) || undefined,
        }))
      : [],
    createdAt: (data.createdAt as string) || "",
    updatedAt: (data.updatedAt as string) || "",
  };
}

export async function fetchApplications(): Promise<JobApplication[]> {
  const res = await apiFetch("/api/job-applications");
  if (!res.ok) throw new Error("Failed to fetch applications");
  const data = await res.json();
  return (data as Record<string, unknown>[]).map(mapApplicationFromBackend);
}

export async function fetchApplicationsPaginated(
  params: SearchParams = {},
): Promise<PaginatedResponse<JobApplication>> {
  const searchParams = new URLSearchParams();

  if (params.page !== undefined) searchParams.set("page", String(params.page));
  if (params.size !== undefined) searchParams.set("size", String(params.size));
  if (params.search) searchParams.set("search", params.search);
  if (params.status) searchParams.set("status", params.status);
  if (params.sortBy) searchParams.set("sortBy", params.sortBy);
  if (params.sortDirection) searchParams.set("sortDirection", params.sortDirection);

  const query = searchParams.toString();
  const url = `/api/job-applications${query ? `?${query}` : ""}`;

  const res = await apiFetch(url);
  if (!res.ok) throw new Error("Failed to fetch applications");

  const data = await res.json();
  const paginated = data as PaginatedResponse<Record<string, unknown>>;

  return {
    ...paginated,
    content: paginated.content.map(mapApplicationFromBackend),
  };
}

export async function fetchApplicationStats(): Promise<ApplicationStats> {
  const res = await apiFetch("/api/job-applications/stats");
  if (!res.ok) throw new Error("Failed to fetch stats");
  return res.json();
}

export async function fetchApplication(id: string): Promise<JobApplication> {
  const res = await apiFetch(`/api/job-applications/${id}`);
  if (!res.ok) throw new Error("Failed to fetch application");
  const data = await res.json();
  return mapApplicationFromBackend(data as Record<string, unknown>);
}

export async function createApplication(
  input: CreateApplicationInput,
): Promise<JobApplication> {
  const res = await apiFetch("/api/job-applications", {
    method: "POST",
    body: JSON.stringify(mapApplicationToBackend(input)),
  });
  if (!res.ok) throw new Error("Failed to create application");
  const data = await res.json();
  return mapApplicationFromBackend(data as Record<string, unknown>);
}

export async function updateApplication(
  id: string,
  input: UpdateApplicationInput,
): Promise<JobApplication> {
  const res = await apiFetch(`/api/job-applications/${id}`, {
    method: "PUT",
    body: JSON.stringify(mapApplicationToBackend(input)),
  });
  if (!res.ok) throw new Error("Failed to update application");
  const data = await res.json();
  return mapApplicationFromBackend(data as Record<string, unknown>);
}

export async function deleteApplication(id: string): Promise<void> {
  const res = await apiFetch(`/api/job-applications/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete application");
}

// ── Interview API ──────────────────────────────────────────────────────────────

export type CreateInterviewInput = {
  type: "PHONE_SCREEN" | "TECHNICAL" | "BEHAVIORAL" | "FINAL_ROUND" | "PANEL" | "OTHER";
  date: string;
  time?: string;
  interviewer?: string;
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED";
  outcome?: "PASSED" | "FAILED" | "PENDING" | "NO_RESPONSE";
  notes?: string;
};

export type UpdateInterviewInput = CreateInterviewInput;

function mapInterviewToBackend(input: CreateInterviewInput): Record<string, unknown> {
  return {
    type: input.type,
    date: input.date,
    time: input.time || null,
    interviewer: input.interviewer || null,
    status: input.status,
    outcome: input.outcome || null,
    notes: input.notes || null,
  };
}

function mapInterviewFromBackend(data: Record<string, unknown>): JobApplication["interviews"][number] {
  return {
    id: String(data.id),
    type: (data.type as JobApplication["interviews"][number]["type"]) || "OTHER",
    date: data.date as string,
    time: (data.time as string) || undefined,
    interviewer: (data.interviewer as string) || undefined,
    status: (data.status as JobApplication["interviews"][number]["status"]) || "SCHEDULED",
    outcome: (data.outcome as JobApplication["interviews"][number]["outcome"]) || undefined,
    notes: (data.notes as string) || undefined,
  };
}

export async function createInterview(
  appId: string,
  input: CreateInterviewInput,
): Promise<JobApplication["interviews"][number]> {
  const res = await apiFetch(`/api/job-applications/${appId}/interviews`, {
    method: "POST",
    body: JSON.stringify(mapInterviewToBackend(input)),
  });
  if (!res.ok) throw new Error("Failed to create interview");
  const data = await res.json();
  return mapInterviewFromBackend(data as Record<string, unknown>);
}

export async function updateInterview(
  appId: string,
  interviewId: string,
  input: UpdateInterviewInput,
): Promise<JobApplication["interviews"][number]> {
  const res = await apiFetch(`/api/job-applications/${appId}/interviews/${interviewId}`, {
    method: "PUT",
    body: JSON.stringify(mapInterviewToBackend(input)),
  });
  if (!res.ok) throw new Error("Failed to update interview");
  const data = await res.json();
  return mapInterviewFromBackend(data as Record<string, unknown>);
}

export async function deleteInterview(appId: string, interviewId: string): Promise<void> {
  const res = await apiFetch(`/api/job-applications/${appId}/interviews/${interviewId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete interview");
}
