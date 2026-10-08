import { apiFetch } from "@/lib/api";
import type { JobFitRequest, JobFitResponse } from "@/lib/types";

function extractErrorMessage(error: unknown, status: number): string {
  if (error && typeof error === "object") {
    const record = error as Record<string, unknown>;
    if (typeof record.message === "string" && record.message.trim()) {
      return record.message;
    }
    const values = Object.values(record).filter(
      (value): value is string => typeof value === "string" && value.trim().length > 0,
    );
    if (values.length > 0) {
      return values.join(" ");
    }
  }
  return `Failed to analyze job fit (${status})`;
}

export async function analyzeJobFit(
  request: JobFitRequest,
): Promise<JobFitResponse> {
  const response = await apiFetch("/api/ai/job-fit", {
    method: "POST",
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(extractErrorMessage(error, response.status));
  }

  return response.json();
}
