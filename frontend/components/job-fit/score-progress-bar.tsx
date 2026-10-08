"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

function clampScore(score: number): number {
  if (!Number.isFinite(score)) return 0;
  return Math.max(0, Math.min(100, Math.round(score)));
}

function barColor(score: number): string {
  if (score < 40) return "bg-destructive";
  if (score < 60) return "bg-amber-500";
  if (score < 75) return "bg-blue-500";
  if (score < 90) return "bg-emerald-500";
  return "bg-emerald-600";
}

export function scoreTextColor(score: number): string {
  const clamped = clampScore(score);
  if (clamped < 40) return "text-destructive";
  if (clamped < 60) return "text-amber-600 dark:text-amber-400";
  if (clamped < 75) return "text-blue-600 dark:text-blue-400";
  return "text-emerald-600 dark:text-emerald-400";
}

interface ScoreProgressBarProps {
  score: number;
  label?: string;
  delay?: number;
  className?: string;
}

export function ScoreProgressBar({
  score,
  label,
  delay = 0,
  className,
}: ScoreProgressBarProps) {
  const clamped = clampScore(score);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setRevealed(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
        className="relative h-2 flex-1 overflow-hidden rounded-full bg-muted"
      >
        <div
          className={cn(
            "h-full rounded-full transition-[width] duration-700 ease-out",
            barColor(clamped),
          )}
          style={{
            width: `${revealed ? clamped : 0}%`,
            transitionDelay: `${delay}ms`,
          }}
        />
      </div>
      <span
        className={cn(
          "w-8 shrink-0 text-right text-sm font-semibold tabular-nums",
          scoreTextColor(clamped),
        )}
      >
        {clamped}
      </span>
      {label ? (
        <span className="shrink-0 text-xs text-muted-foreground">{label}</span>
      ) : null}
    </div>
  );
}
