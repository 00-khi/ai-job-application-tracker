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
  workMode?: string;
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

// ── AI Bullet Generation Types ───────────────────────────────────────────────

export type Seniority = "JUNIOR" | "MID_LEVEL" | "SENIOR" | "PRINCIPAL";

export type BulletTone =
  | "IMPACT"
  | "STAR"
  | "TECHNICAL"
  | "LEADERSHIP"
  | "QUANTITATIVE"
  | "COLLABORATIVE"
  | "INNOVATION";

export interface BulletGenerationRequest {
  jobTitle: string;
  seniority: Seniority;
  skills: string[];
  achievements: string;
  existingBullets?: string;
  tone: BulletTone;
}

export interface BulletGenerationResponse {
  bullets: string[];
}

// ── AI Job Fit Types ─────────────────────────────────────────────────────────

export type ScoreLabel = "POOR" | "WEAK" | "FAIR" | "STRONG" | "ELITE";

export type Severity = "HIGH" | "MEDIUM" | "LOW";

export type Priority = "HIGH" | "MEDIUM" | "LOW";

export type Strictness = "STRICT" | "BALANCED" | "LENIENT";

export interface JobFitRequest {
  resume: string;
  jobDescription: string;
  strictness: Strictness;
}

export interface ScoreBreakdownItem {
  dimension: string;
  score: number;
  comment: string;
}

export interface StrengthItem {
  area: string;
  detail: string;
  whyItMatters: string;
}

export interface WeaknessItem {
  area: string;
  detail: string;
  impact: string;
}

export interface ScoredAnalysis {
  rating: number;
  summary: string;
  findings: string[];
}

export interface PositionDimension {
  dimension: string;
  score: number;
}

export interface RecommendedPosition {
  position: string;
  fitScore: number;
  dimensions: PositionDimension[];
}

export interface RedFlag {
  flag: string;
  severity: Severity;
  detail: string;
}

export interface AtsAnalysis {
  score: number;
  keywordMatchPercent: number;
  missingKeywords: string[];
  formatIssues: string[];
  assessment: string;
}

export interface SectionImprovement {
  section: string;
  issue: string;
  recommendation: string;
  priority: Priority;
}

export interface BulletImprovement {
  original: string;
  improved: string;
  reason: string;
}

export interface ActionPlanItem {
  priority: Priority;
  action: string;
  timeframe: string;
  expectedImpact: string;
}

export interface JobFitResponse {
  overallScore: number;
  scoreLabel: ScoreLabel;
  interviewProbability: number;
  executiveAssessment: string;
  scoreBreakdown: ScoreBreakdownItem[];
  strongestParts: StrengthItem[];
  weakestParts: WeaknessItem[];
  experienceAnalysis: ScoredAnalysis;
  projectAnalysis: ScoredAnalysis;
  metricsImpactAnalysis: ScoredAnalysis;
  careerDirection: string;
  recommendedPositions: RecommendedPosition[];
  redFlags: RedFlag[];
  atsAnalysis: AtsAnalysis;
  sectionImprovements: SectionImprovement[];
  bulletImprovements: BulletImprovement[];
  actionPlan: ActionPlanItem[];
}
