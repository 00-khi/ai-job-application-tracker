"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertTriangleIcon,
  CheckIcon,
  ClockIcon,
  XIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { priorityConfig, severityConfig } from "@/lib/enum-labels";
import type {
  ActionPlanItem,
  AtsAnalysis,
  BulletImprovement,
  RedFlag,
  SectionImprovement,
} from "@/lib/types";

import { ScoreProgressBar } from "./score-progress-bar";

// ── Red Flags ────────────────────────────────────────────────────────────────

export function RedFlags({ flags }: { flags: RedFlag[] }) {
  if (!flags?.length) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-destructive/10">
            <AlertTriangleIcon className="h-4 w-4 text-destructive" />
          </span>
          Red Flags
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="divide-y divide-border">
          {flags.map((flag) => {
            const config = severityConfig[flag.severity] ?? severityConfig.LOW;
            return (
              <li
                key={flag.flag}
                className="flex flex-col gap-2 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-start sm:gap-4"
              >
                <Badge
                  variant="outline"
                  className={cn("w-fit shrink-0", config.className)}
                >
                  {config.label}
                </Badge>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{flag.flag}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {flag.detail}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}

// ── ATS Analysis ─────────────────────────────────────────────────────────────

export function AtsAnalysisCard({ analysis }: { analysis: AtsAnalysis }) {
  if (!analysis) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>ATS Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <p className="text-sm font-medium">ATS score</p>
            <ScoreProgressBar score={analysis.score} />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Keyword match</p>
            <ScoreProgressBar
              score={analysis.keywordMatchPercent}
              label="%"
              delay={75}
            />
          </div>
        </div>

        {analysis.missingKeywords?.length ? (
          <div className="space-y-2">
            <p className="text-sm font-medium">Missing keywords</p>
            <div className="flex flex-wrap gap-1.5">
              {analysis.missingKeywords.map((keyword) => (
                <Badge key={keyword} variant="outline">
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>
        ) : null}

        {analysis.formatIssues?.length ? (
          <div className="space-y-2">
            <p className="text-sm font-medium">Format issues</p>
            <ul className="space-y-2">
              {analysis.formatIssues.map((issue) => (
                <li key={issue} className="flex gap-2.5">
                  <AlertTriangleIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
                  <span className="text-sm leading-relaxed">{issue}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="space-y-1.5">
          <p className="text-sm font-medium">Assessment</p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {analysis.assessment}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Section Improvements ─────────────────────────────────────────────────────

export function SectionImprovements({
  items,
}: {
  items: SectionImprovement[];
}) {
  if (!items?.length) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Section Improvements</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="divide-y divide-border">
          {items.map((item) => {
            const config = priorityConfig[item.priority] ?? priorityConfig.LOW;
            return (
              <li
                key={item.section}
                className="space-y-1.5 py-4 first:pt-0 last:pb-0"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium">{item.section}</p>
                  <Badge
                    variant="outline"
                    className={cn("shrink-0", config.className)}
                  >
                    {config.label}
                  </Badge>
                </div>
                <p className="text-sm leading-relaxed">{item.issue}</p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {item.recommendation}
                </p>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}

// ── Bullet Improvements ──────────────────────────────────────────────────────

export function BulletImprovements({ items }: { items: BulletImprovement[] }) {
  if (!items?.length) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bullet Improvements</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="space-y-2.5">
              <div className="flex gap-2.5">
                <XIcon className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                <p className="text-sm leading-relaxed text-muted-foreground line-through decoration-destructive/50">
                  {item.original}
                </p>
              </div>
              <div className="flex gap-2.5 rounded-xl bg-emerald-500/5 p-3">
                <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <p className="text-sm leading-relaxed">{item.improved}</p>
              </div>
              <p className="pl-6 text-xs leading-relaxed text-muted-foreground">
                {item.reason}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ── Action Plan ──────────────────────────────────────────────────────────────

export function ActionPlan({ items }: { items: ActionPlanItem[] }) {
  if (!items?.length) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Action Plan</CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="divide-y divide-border">
          {items.map((item, index) => {
            const config = priorityConfig[item.priority] ?? priorityConfig.LOW;
            return (
              <li key={index} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold tabular-nums">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className={config.className}>
                      {config.label}
                    </Badge>
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <ClockIcon className="h-3 w-3" />
                      {item.timeframe}
                    </span>
                  </div>
                  <p className="text-sm leading-snug font-medium">
                    {item.action}
                  </p>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {item.expectedImpact}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </CardContent>
    </Card>
  );
}
