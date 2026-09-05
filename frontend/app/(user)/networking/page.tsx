import { PageHeader } from "@/components/reusables/page-header";
import { AiDisclaimerCard } from "@/components/reusables/ai-disclaimer-card";

export default function NetworkingPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Networking"
        description="Manage your professional connections and outreach"
      />
      <AiDisclaimerCard />
    </div>
  );
}
