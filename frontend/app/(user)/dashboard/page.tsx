import { PageHeader } from "@/components/reusables/page-header";
import { StatCard } from "@/components/reusables/stat-card";
import { Button } from "@/components/ui/button";
import { Briefcase, Calendar, FileText, Sparkles } from "lucide-react";

export default function DashboardPage() {
  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Overview of your progress"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Resume score" value="87" hint="" icon={FileText} />
        <StatCard label="Applications" value="50" hint="" icon={Briefcase} />
        <StatCard label="Interviews" value="3" hint="" icon={Calendar} />
        <StatCard label="AI generations" value="42" hint="" icon={Sparkles} />
      </div>
    </div>
  );
}
