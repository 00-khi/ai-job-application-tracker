import { PageHeader } from "@/components/reusables/page-header";
import { AiDisclaimerCard } from "@/components/reusables/ai-disclaimer-card";

export default function JobFitPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Job Fit"
        description="Analyze how well your skills match job requirements"
      />
      <AiDisclaimerCard />
    </div>
  );
}
