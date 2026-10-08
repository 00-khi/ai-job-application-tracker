"use client";

import { useEffect, useState } from "react";
import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { RecommendedPosition } from "@/lib/types";

import { ScoreProgressBar } from "./score-progress-bar";

const POSITION_DIMENSIONS = [
  "Skills Match",
  "Experience",
  "Seniority Fit",
  "Domain Fit",
  "Growth Potential",
];

const RADAR_COLORS = [
  "#3b82f6", // blue-500 (primary)
  "#f59e0b", // amber-500
  "#8b5cf6", // violet-500
  "#10b981", // emerald-500
  "#0ea5e9", // sky-500
];

const FALLBACK_THEME = {
  grid: "#e5e7eb",
  axis: "#6b7280",
};

function readChartTheme() {
  if (typeof window === "undefined") return FALLBACK_THEME;
  const styles = getComputedStyle(document.documentElement);
  return {
    grid: styles.getPropertyValue("--border").trim() || FALLBACK_THEME.grid,
    axis:
      styles.getPropertyValue("--muted-foreground").trim() ||
      FALLBACK_THEME.axis,
  };
}

interface RecommendedPositionsProps {
  positions: RecommendedPosition[];
}

export function RecommendedPositions({ positions }: RecommendedPositionsProps) {
  const [theme, setTheme] = useState(FALLBACK_THEME);

  useEffect(() => {
    const update = () => setTheme(readChartTheme());
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  if (!positions?.length) return null;

  const data = POSITION_DIMENSIONS.map((dimension) => {
    const row: Record<string, string | number> = { dimension };
    for (const position of positions) {
      const match = position.dimensions?.find(
        (item) => item.dimension === dimension,
      );
      row[position.position] = match?.score ?? 0;
    }
    return row;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommended Positions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="h-[340px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={data} margin={{ top: 8, right: 32, bottom: 8, left: 32 }}>
              <PolarGrid stroke={theme.grid} />
              <PolarAngleAxis
                dataKey="dimension"
                tick={{ fill: theme.axis, fontSize: 11 }}
              />
              <PolarRadiusAxis
                domain={[0, 100]}
                tick={false}
                axisLine={false}
              />
              {positions.map((position, index) => (
                <Radar
                  key={position.position}
                  name={position.position}
                  dataKey={position.position}
                  stroke={RADAR_COLORS[index % RADAR_COLORS.length]}
                  fill={RADAR_COLORS[index % RADAR_COLORS.length]}
                  fillOpacity={0.12}
                  strokeWidth={2}
                />
              ))}
              <Legend
                wrapperStyle={{ fontSize: 12, color: theme.axis }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--popover)",
                  color: "var(--popover-foreground)",
                  border: "1px solid var(--border)",
                  borderRadius: 10,
                  fontSize: 12,
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <ul className="divide-y divide-border border-t border-border pt-2">
          {positions.map((position, index) => (
            <li key={position.position} className="py-3 first:pt-0 last:pb-0">
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{
                    backgroundColor: RADAR_COLORS[index % RADAR_COLORS.length],
                  }}
                />
                <span className="text-sm font-medium">{position.position}</span>
              </div>
              <ScoreProgressBar
                score={position.fitScore}
                className="mt-2"
                delay={index * 75}
              />
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
