"use client";

import { AlarmClock, CircleCheck, Hourglass, Timer } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ErrorState } from "@/components/shared/ErrorState";
import { StatCard } from "@/components/shared/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useStaffPerformance } from "@/hook";
import { REQUEST_STATUSES, STATUS_META } from "@/lib/status";

const tick = { fontSize: 11, fill: "var(--muted-foreground)" };
const tooltipStyle = {
  background: "var(--popover)",
  color: "var(--popover-foreground)",
  border: "1px solid var(--border)",
  borderRadius: 8,
  fontSize: 12,
};

export function StaffPerformanceView() {
  const { data, isLoading, isError, error, refetch } = useStaffPerformance();

  if (isLoading) {
    return (
      <div aria-busy="true" className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-80 w-full rounded-xl" />
      </div>
    );
  }

  if (isError || !data) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  const s = data.data;
  const chartData = REQUEST_STATUSES.map((key) => ({
    name: STATUS_META[key].label,
    value: s.byStatus[key] ?? 0,
  }));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Resolved" value={s.resolved} icon={CircleCheck} tone="success" />
        <StatCard title="In progress" value={s.inProgress} icon={Hourglass} />
        <StatCard
          title="Overdue"
          value={s.overdue}
          icon={AlarmClock}
          tone={s.overdue > 0 ? "danger" : "success"}
        />
        <StatCard
          title="Avg. resolution time"
          value={s.avgResolutionHours === null ? "—" : `${s.avgResolutionHours} h`}
          icon={Timer}
          hint={s.onTimeRate === null ? undefined : `${s.onTimeRate}% resolved on time`}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My requests by status</CardTitle>
        </CardHeader>
        <CardContent>
          <div role="img" aria-label="Bar chart of my requests by status" className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ left: -16, right: 8 }}>
                <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={tick} interval={0} angle={-25} textAnchor="end" height={60} />
                <YAxis allowDecimals={false} tick={tick} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--muted)", opacity: 0.4 }} />
                <Bar dataKey="value" name="Requests" fill="var(--chart-3)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}