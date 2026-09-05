import { AiDisclaimerCard } from "@/components/reusables/ai-disclaimer-card";
import { PageHeader } from "@/components/reusables/page-header";

export default function BulletsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Bullet Generator"
        description="Generate impactful bullet points for your experience"
      />
      <AiDisclaimerCard />
    </div>
  );
}
