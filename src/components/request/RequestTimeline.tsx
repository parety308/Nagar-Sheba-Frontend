import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatDateTime } from "@/lib/format";
import type { ServiceRequest } from "@/types/request.type";

export function RequestTimeline({ request }: { request: ServiceRequest }) {
  const history = request.statusHistory ?? [];

  return (
    <ol className="relative space-y-6 border-l pl-6">
      {/* The backend records history on transitions only, so show creation explicitly */}
      <li className="relative">
        <span className="absolute top-1.5 -left-[30px] size-2.5 rounded-full bg-primary ring-4 ring-card" />
        <p className="text-sm font-medium">Request created</p>
        <p className="text-xs text-muted-foreground">
          {formatDateTime(request.createdAt)}
        </p>
      </li>

      {history.map((item) => (
        <li key={item.id} className="relative">
          <span className="absolute top-1.5 -left-[30px] size-2.5 rounded-full bg-muted-foreground ring-4 ring-card" />
          <div className="flex flex-wrap items-center gap-2">
            {item.fromStatus && <StatusBadge status={item.fromStatus} />}
            {item.fromStatus && (
              <span className="text-xs text-muted-foreground">to</span>
            )}
            <StatusBadge status={item.toStatus} />
          </div>
          {item.note && <p className="mt-1.5 text-sm">{item.note}</p>}
          <p className="mt-1 text-xs text-muted-foreground">
            {formatDateTime(item.createdAt)}
          </p>
        </li>
      ))}
    </ol>
  );
}
