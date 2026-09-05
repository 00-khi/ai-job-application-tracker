"use client";

import { useState } from "react";
import { Info, X } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AiDisclaimerCardProps {
  className?: string;
}

export function AiDisclaimerCard({ className }: AiDisclaimerCardProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <Card
      data-slot="ai-disclaimer-card"
      className={cn(
        "p-0 animate-in fade-in-0 slide-in-from-top-1 duration-300 bg-muted/40 ring-foreground/5",
        className
      )}
    >
      <CardContent className="flex items-start gap-3 p-5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
          <Info className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">Free Tier Notice</p>
          <p className="mt-1 text-sm text-muted-foreground">
            This app uses free-tier AI services. Expect occasional rate limits or
            slower responses during peak usage.
          </p>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:scale-[0.96]"
          aria-label="Dismiss disclaimer"
        >
          <X className="h-4 w-4" />
        </button>
      </CardContent>
    </Card>
  );
}
