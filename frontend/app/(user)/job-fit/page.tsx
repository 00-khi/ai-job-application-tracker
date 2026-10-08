"use client";

import { useState, useCallback } from "react";
import { PageHeader } from "@/components/reusables/page-header";
import { AiDisclaimerCard } from "@/components/reusables/ai-disclaimer-card";
import { JobFitForm } from "@/components/job-fit/job-fit-form";
import { JobFitResults } from "@/components/job-fit/job-fit-results";
import { analyzeJobFit } from "@/lib/job-fit";
import type { JobFitRequest, JobFitResponse } from "@/lib/types";

export default function JobFitPage() {
  const [result, setResult] = useState<JobFitResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRequest, setLastRequest] = useState<JobFitRequest | null>(null);

  const handleGenerate = useCallback(async (request: JobFitRequest) => {
    setLoading(true);
    setError(null);
    setLastRequest(request);
    try {
      const response = await analyzeJobFit(request);
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRetry = useCallback(async () => {
    if (lastRequest) {
      await handleGenerate(lastRequest);
    }
  }, [lastRequest, handleGenerate]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Job Fit"
        description="Get a strict, honest match analysis between your resume and a job description"
      />
      <AiDisclaimerCard />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <JobFitForm onGenerate={handleGenerate} loading={loading} />
        </div>
        <div className="lg:col-span-2">
          <JobFitResults
            result={result}
            loading={loading}
            error={error}
            onRetry={handleRetry}
          />
        </div>
      </div>
    </div>
  );
}
