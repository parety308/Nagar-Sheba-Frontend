import { Building2, CircleCheck, ClipboardList, Star } from "lucide-react";
import { CountUp } from "@/components/motion/CountUp";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { StatCard } from "@/components/shared/StatCard";
import type { PublicStats } from "@/types/public.type";

export function StatsStrip({ stats }: { stats: PublicStats | null }) {
  if (!stats) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StaggerItem>
          <StatCard
            title="Requests filed"
            value={<CountUp value={stats.totalRequests} />}
            icon={ClipboardList}
          />
        </StaggerItem>
        <StaggerItem>
          <StatCard
            title="Issues resolved"
            value={<CountUp value={stats.resolvedRequests} />}
            icon={CircleCheck}
            tone="success"
          />
        </StaggerItem>
        <StaggerItem>
          <StatCard
            title="City departments"
            value={<CountUp value={stats.departments} />}
            icon={Building2}
          />
        </StaggerItem>
        <StaggerItem>
          <StatCard
            title="Citizen rating"
            value={
              stats.averageRating ? (
                <CountUp
                  value={stats.averageRating}
                  decimals={1}
                  suffix=" / 5"
                />
              ) : (
                "New"
              )
            }
            icon={Star}
            tone="warning"
          />
        </StaggerItem>
      </Stagger>
    </section>
  );
}
