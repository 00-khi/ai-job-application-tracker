"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangleIcon, SparklesIcon } from "lucide-react";

import type { JobFitResponse } from "@/lib/types";

import {
  CareerDirection,
  ScoreBreakdown,
  ScoreSummary,
  ScoredAnalyses,
  StrengthsWeaknesses,
} from "./job-fit-overview";
import {
  ActionPlan,
  AtsAnalysisCard,
  BulletImprovements,
  RedFlags,
  SectionImprovements,
} from "./job-fit-details";
import { RecommendedPositions } from "./recommended-positions";

interface JobFitResultsProps {
  result: JobFitResponse | null;
  loading: boolean;
  error: string | null;
  onRetry?: () => void;
}

function ResultsSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="flex flex-col gap-5">
          <div className="flex items-center justify-between gap-4">
            <Skeleton className="h-14 w-24" />
            <Skeleton className="h-6 w-20 rounded-4xl" />
          </div>
          <Skeleton className="h-2 w-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </CardContent>
      </Card>
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardContent className="flex flex-col gap-3">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-2 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function JobFitResults({
  result,
  loading,
  error,
  onRetry,
}: JobFitResultsProps) {
  if (loading) {
    return <ResultsSkeleton />;
  }

  if (error) {
    return (
      <Card className="h-min">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10">
            <AlertTriangleIcon className="h-5 w-5 text-destructive" />
          </div>
          <p className="mt-4 text-sm font-medium">Failed to analyze job fit</p>
          <p className="mt-1 text-sm text-muted-foreground">{error}</p>
          {onRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="mt-4"
            >
              Retry
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  if (!result) {
    return (
      <Card className="h-min">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
            <SparklesIcon className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="mt-4 text-sm font-medium">No analysis yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Paste your resume and a job description, then click Analyze Fit to
            see your match report.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-300">
      <ScoreSummary result={result} />
      <ScoreBreakdown items={result.scoreBreakdown} />
      <StrengthsWeaknesses
        strongest={result.strongestParts}
        weakest={result.weakestParts}
      />
      <ScoredAnalyses
        experience={result.experienceAnalysis}
        projects={result.projectAnalysis}
        metrics={result.metricsImpactAnalysis}
      />
      <RecommendedPositions positions={result.recommendedPositions} />
      <CareerDirection text={result.careerDirection} />
      <RedFlags flags={result.redFlags} />
      <AtsAnalysisCard analysis={result.atsAnalysis} />
      <SectionImprovements items={result.sectionImprovements} />
      <BulletImprovements items={result.bulletImprovements} />
      <ActionPlan items={result.actionPlan} />
    </div>
  );
}

export { JobFitResults };
