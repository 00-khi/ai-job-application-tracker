"use client";

import { useState } from "react";
import { Loader2, WifiOff, X } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BackendTimeoutCardProps {
  onRetry?: () => void;
  className?: string;
}

export function BackendTimeoutCard({ onRetry, className }: BackendTimeoutCardProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isRetrying, setIsRetrying] = useState(false);

  if (!isVisible) return null;

  async function handleRetry() {
    if (!onRetry) return;
    setIsRetrying(true);
    try {
      await onRetry();
    } finally {
      setIsRetrying(false);
    }
  }

  return (
    <Card
      data-slot="backend-timeout-card"
      className={cn(
        "p-0 animate-in fade-in-0 slide-in-from-top-1 duration-300 bg-muted/40 ring-foreground/5",
        className
      )}
    >
      <CardContent className="flex items-start gap-3 p-5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
          <WifiOff className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">Backend might be waking up</p>
          <p className="mt-1 text-sm text-muted-foreground">
            This may take a moment. Please wait and try again.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {onRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRetry}
              disabled={isRetrying}
              className="shrink-0 active:scale-[0.96] transition-transform"
            >
              {isRetrying ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Retry"
              )}
            </Button>
          )}
          <button
            onClick={() => setIsVisible(false)}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:scale-[0.96]"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
