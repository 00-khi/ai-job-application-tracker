import { PageHeader } from "@/components/reusables/page-header";
import { StatCard } from "@/components/reusables/stat-card";
import { useApplicationStats } from "@/hooks/useApplicationStats";
import { Briefcase, Calendar, Trophy, XCircle } from "lucide-react";

export default function DashboardPage() {
  const stats = useApplicationStats();

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Track and manage your job applications"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Applications" value={String(stats.total)} hint="Total tracked" icon={Briefcase} />
        <StatCard label="Interviews" value={String(stats.totalInterviews)} hint="Across all apps" icon={Calendar} />
        <StatCard label="Offers" value={String(stats.offers)} hint="Pending decisions" icon={Trophy} />
        <StatCard label="Rejected" value={String(stats.rejected)} hint="Did not advance" icon={XCircle} />
      </div>

      <div>
        {/* SEARCH & FILTERS */}
      </div>

      <div>
        {/* TABLE */}
      </div>
    </div>
  );
}
