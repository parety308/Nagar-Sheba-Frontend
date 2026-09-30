import { Badge } from "@/components/ui/badge";
import { toEnumLabel } from "@/lib/format";
import { STATUS_META } from "@/lib/status";
import { cn } from "@/lib/utils";

export function StatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  const meta = STATUS_META[status];

  return (
    <Badge
      variant="outline"
      className={cn("border-transparent px-2.5", meta?.className, className)}
    >
      {meta?.label ?? toEnumLabel(status)}
    </Badge>
  );
}
