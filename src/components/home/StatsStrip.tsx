import { Building2, CircleCheck, ClipboardList, Star } from "lucide-react";
import { StatCard } from "@/components/shared/StatCard";
import type { PublicStats } from "@/types/public.type";

export function StatsStrip({ stats }: { stats: PublicStats | null }) {
  if (!stats) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Requests filed"
          value={stats.totalRequests.toLocaleString()}
          icon={ClipboardList}
        />
        <StatCard
          title="Issues resolved"
          value={stats.resolvedRequests.toLocaleString()}
          icon={CircleCheck}
          tone="success"
        />
        <StatCard
          title="City departments"
          value={stats.departments}
          icon={Building2}
        />
        <StatCard
          title="Citizen rating"
          value={
            stats.averageRating
              ? `${stats.averageRating.toFixed(1)} / 5`
              : "New"
          }
          icon={Star}
          tone="warning"
        />
      </div>
    </section>
  );
}
