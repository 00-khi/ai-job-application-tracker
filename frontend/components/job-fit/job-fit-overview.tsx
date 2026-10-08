"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertTriangleIcon,
  ThumbsUpIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { scoreLabelConfig } from "@/lib/enum-labels";
import type {
  JobFitResponse,
  ScoreBreakdownItem,
  ScoredAnalysis,
  StrengthItem,
  WeaknessItem,
} from "@/lib/types";

import { ScoreProgressBar, scoreTextColor } from "./score-progress-bar";

// ── Score Summary ────────────────────────────────────────────────────────────

export function ScoreSummary({ result }: { result: JobFitResponse }) {
  const labelConfig =
    scoreLabelConfig[result.scoreLabel] ?? scoreLabelConfig.FAIR;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fit Score</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p
              className={cn(
                "text-5xl leading-none font-semibold tracking-tight tabular-nums",
                scoreTextColor(result.overallScore),
              )}
            >
              {Math.round(result.overallScore)}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Overall fit score
            </p>
          </div>
          <Badge
            variant="outline"
            className={cn("h-6 px-2.5 text-xs font-semibold", labelConfig.className)}
          >
            {labelConfig.label}
          </Badge>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Interview probability</p>
          <ScoreProgressBar
            score={result.interviewProbability}
            label="%"
            delay={150}
          />
        </div>

        <div className="space-y-1.5">
          <p className="text-sm font-medium">Executive assessment</p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {result.executiveAssessment}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Score Breakdown ──────────────────────────────────────────────────────────

export function ScoreBreakdown({ items }: { items: ScoreBreakdownItem[] }) {
  if (!items?.length) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Score Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="divide-y divide-border">
          {items.map((item, index) => (
            <li key={item.dimension} className="space-y-2 py-4 first:pt-0 last:pb-0">
              <p className="text-sm font-medium">{item.dimension}</p>
              <ScoreProgressBar score={item.score} delay={index * 75} />
              <p className="text-sm leading-relaxed text-muted-foreground">
                {item.comment}
              </p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

// ── Strongest / Weakest Parts ────────────────────────────────────────────────

function StrengthItemRow({ item }: { item: StrengthItem }) {
  return (
    <li className="space-y-1.5 py-4 first:pt-0 last:pb-0">
      <p className="text-[11px] font-medium tracking-wider uppercase">
        {item.area}
      </p>
      <p className="text-sm leading-relaxed">{item.detail}</p>
      <p className="text-sm leading-relaxed text-muted-foreground">
        {item.whyItMatters}
      </p>
    </li>
  );
}

function WeaknessItemRow({ item }: { item: WeaknessItem }) {
  return (
    <li className="space-y-1.5 py-4 first:pt-0 last:pb-0">
      <p className="text-[11px] font-medium tracking-wider uppercase">
        {item.area}
      </p>
      <p className="text-sm leading-relaxed">{item.detail}</p>
      <p className="text-sm leading-relaxed text-muted-foreground">
        {item.impact}
      </p>
    </li>
  );
}

export function StrengthsWeaknesses({
  strongest,
  weakest,
}: {
  strongest: StrengthItem[];
  weakest: WeaknessItem[];
}) {
  if (!strongest?.length && !weakest?.length) return null;

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {strongest?.length ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10">
                <ThumbsUpIcon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </span>
              Strongest Parts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-border">
              {strongest.map((item) => (
                <StrengthItemRow key={item.area} item={item} />
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : null}

      {weakest?.length ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-destructive/10">
                <AlertTriangleIcon className="h-4 w-4 text-destructive" />
              </span>
              Weakest Parts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-border">
              {weakest.map((item) => (
                <WeaknessItemRow key={item.area} item={item} />
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

// ── Experience / Project / Metrics Analyses ──────────────────────────────────

function AnalysisCard({
  title,
  analysis,
  delay,
}: {
  title: string;
  analysis: ScoredAnalysis;
  delay: number;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Rating</p>
          <ScoreProgressBar score={analysis.rating} delay={delay} />
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {analysis.summary}
        </p>
        {analysis.findings?.length ? (
          <ul className="space-y-2">
            {analysis.findings.map((finding) => (
              <li key={finding} className="flex gap-2.5">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/30" />
                <span className="text-sm leading-relaxed">{finding}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function ScoredAnalyses({
  experience,
  projects,
  metrics,
}: {
  experience: ScoredAnalysis;
  projects: ScoredAnalysis;
  metrics: ScoredAnalysis;
}) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <AnalysisCard title="Experience Analysis" analysis={experience} delay={0} />
      <AnalysisCard title="Project Analysis" analysis={projects} delay={75} />
      <AnalysisCard
        title="Metrics Impact Analysis"
        analysis={metrics}
        delay={150}
      />
    </div>
  );
}

// ── Career Direction ─────────────────────────────────────────────────────────

export function CareerDirection({ text }: { text: string }) {
  if (!text?.trim()) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Career Direction</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="max-w-[75ch] text-sm leading-relaxed text-muted-foreground">
          {text}
        </p>
      </CardContent>
    </Card>
  );
}
