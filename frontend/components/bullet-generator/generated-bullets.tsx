"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CopyIcon, CheckIcon, SparklesIcon, AlertTriangleIcon } from "lucide-react";

interface GeneratedBulletsProps {
  bullets: string[];
  loading: boolean;
  error: string | null;
  onRetry?: () => void;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Button
      variant="ghost"
      size="icon-xs"
      onClick={handleCopy}
      className="shrink-0"
      aria-label={copied ? "Copied" : "Copy to clipboard"}
    >
      {copied ? (
        <CheckIcon className="h-3.5 w-3.5 text-green-600" />
      ) : (
        <CopyIcon className="h-3.5 w-3.5" />
      )}
    </Button>
  );
}

function BulletCard({ bullet }: { bullet: string }) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-3">
        <p className="flex-1 text-sm leading-relaxed">{bullet}</p>
        <div className="flex justify-end">
          <CopyButton text={bullet} />
        </div>
      </CardContent>
    </Card>
  );
}

function GeneratedBullets({ bullets, loading, error, onRetry }: GeneratedBulletsProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="flex flex-col gap-3">
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <div className="flex justify-end">
                <Skeleton className="h-7 w-7 rounded-md" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="h-min">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10">
            <AlertTriangleIcon className="h-5 w-5 text-destructive" />
          </div>
          <p className="mt-4 text-sm font-medium">Failed to generate bullets</p>
          <p className="mt-1 text-sm text-muted-foreground">{error}</p>
          {onRetry && (
            <Button variant="outline" size="sm" onClick={onRetry} className="mt-4">
              Retry
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  if (bullets.length === 0) {
    return (
      <Card className="h-min">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
            <SparklesIcon className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="mt-4 text-sm font-medium">No bullets generated yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Fill in the form and click Generate to create tailored bullet points.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {bullets.map((bullet, index) => (
        <BulletCard key={index} bullet={bullet} />
      ))}
    </div>
  );
}

export { GeneratedBullets };
