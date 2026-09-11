// ── Application Types ─────────────────────────────────────────────────────────

export type ApplicationStatus =
  | "SAVED"
  | "APPLIED"
  | "PHONE_SCREEN"
  | "INTERVIEWING"
  | "ASSESSMENT"
  | "FINAL_ROUND"
  | "OFFER"
  | "REJECTED"
  | "WITHDRAWN"
  | "DECLINED"
  | "ACCEPTED"
  | "CLOSED";

export type JobType = "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP";

export type WorkMode = "REMOTE" | "HYBRID" | "ON_SITE";

export interface Interview {
  id: string;
  type:
    | "PHONE_SCREEN"
    | "TECHNICAL"
    | "BEHAVIORAL"
    | "FINAL_ROUND"
    | "PANEL"
    | "OTHER";
  date: string;
  time?: string;
  interviewer?: string;
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED";
  outcome?: "PASSED" | "FAILED" | "PENDING" | "NO_RESPONSE";
  notes?: string;
}

export interface JobApplication {
  id: string;
  company: string;
  title: string;
  location: string;
  workMode: WorkMode;
  jobType: JobType;
  salaryMin?: number;
  salaryMax?: number;
  currency: string;
  status: ApplicationStatus;
  dateApplied: string;
  source: string;
  contactName?: string;
  contactEmail?: string;
  jobUrl?: string;
  notes?: string;
  tags?: string[];
  interviews: Interview[];
  createdAt: string;
  updatedAt: string;
}

// ── API Types ─────────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface SearchParams {
  page?: number;
  size?: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
}

export interface ApplicationStats {
  total: number;
  saved: number;
  totalInterviews: number;
  offers: number;
  rejected: number;
  byStatus: Record<string, number>;
}
