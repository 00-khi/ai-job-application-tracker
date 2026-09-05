import { AiDisclaimerCard } from "@/components/reusables/ai-disclaimer-card";
import { PageHeader } from "@/components/reusables/page-header";

export default function CoverLetterPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Cover Letter"
        description="Create tailored cover letters for each application"
      />
      <AiDisclaimerCard />
    </div>
  );
}
