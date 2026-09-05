import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { applicationStatusConfig } from "@/lib/enum-labels";
import type { ApplicationStatus } from "@/data/mock-data";

const statusConfig = applicationStatusConfig;

function StatusBadge({
  status,
  className,
}: {
  status: ApplicationStatus;
  className?: string;
}) {
  const config = statusConfig[status];

  return (
    <Badge variant="outline" className={cn(config.className, className)}>
      {config.label}
    </Badge>
  );
}

export { StatusBadge, statusConfig };
