"use client";

import { useState, useCallback } from "react";
import { PageHeader } from "@/components/reusables/page-header";
import { AiDisclaimerCard } from "@/components/reusables/ai-disclaimer-card";
import { BulletGeneratorForm } from "@/components/bullet-generator/bullet-generator-form";
import { GeneratedBullets } from "@/components/bullet-generator/generated-bullets";
import { generateBullets } from "@/lib/bullets";
import type { BulletGenerationRequest } from "@/lib/types";

export default function BulletsPage() {
  const [bullets, setBullets] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRequest, setLastRequest] = useState<BulletGenerationRequest | null>(null);

  const handleGenerate = useCallback(async (request: BulletGenerationRequest) => {
    setLoading(true);
    setError(null);
    setLastRequest(request);
    try {
      const response = await generateBullets(request);
      setBullets(response.bullets);
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
        title="Bullet Generator"
        description="Generate impactful bullet points for your experience"
      />
      <AiDisclaimerCard />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BulletGeneratorForm onGenerate={handleGenerate} loading={loading} />
        <GeneratedBullets
          bullets={bullets}
          loading={loading}
          error={error}
          onRetry={handleRetry}
        />
      </div>
    </div>
  );
}
