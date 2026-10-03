"use client";

import {
  AlarmClock,
  CircleCheck,
  ClipboardList,
  Inbox,
  Star,
  Users,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardStats, useRequests } from "@/hook";
import { formatCurrency, formatDate } from "@/lib/format";
import { REQUEST_STATUSES, STATUS_META } from "@/lib/status";

const tooltipStyle = {
  background: "var(--popover)",
  color: "var(--popover-foreground)",
  border: "1px solid var(--border)",
  borderRadius: 8,
  fontSize: 12,
};

const tick = {
  fontSize: 11,
  fill: "var(--muted-foreground)",
};

export function AdminOverview() {
  const stats = useDashboardStats();
  const recent = useRequests({ limit: 5 });

  if (stats.isLoading) {
    return (
      <div aria-busy="true">
        <Skeleton className="mb-6 h-8 w-56" />
        <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-80 w-full rounded-xl" />
      </div>
    );
  }

  if (stats.isError || !stats.data) {
    return <ErrorState error={stats.error} onRetry={() => stats.refetch()} />;
  }

  const s = stats.data.data;

  const statusData = REQUEST_STATUSES.map((key) => ({
    name: STATUS_META[key].label,
    value: s.requests.byStatus[key] ?? 0,
  }));

  const admins = Math.max(s.users.total - s.users.citizens - s.users.staff, 0);

  const userData = [
    {
      name: "Citizens",
      value: s.users.citizens,
      fill: "var(--chart-1)",
    },
    {
      name: "Staff",
      value: s.users.staff,
      fill: "var(--chart-3)",
    },
    {
      name: "Admins",
      value: admins,
      fill: "var(--chart-5)",
    },
  ];

  const deptData = (s.requests.byDepartment ?? []).map((d) => ({
  name: d.name,
  value: d.total,
}));
  return (
    <div>
      <PageHeader
        title="Platform overview"
        description="Requests, people and revenue across every department."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="Total requests"
          value={s.requests.total.toLocaleString()}
          icon={ClipboardList}
        />

        <StatCard
          title="Overdue requests"
          value={s.requests.overdue}
          icon={AlarmClock}
          tone={s.requests.overdue > 0 ? "danger" : "success"}
          hint="Past their SLA deadline"
        />

        <StatCard
          title="Registered users"
          value={s.users.total.toLocaleString()}
          icon={Users}
        />

        <StatCard
          title="Revenue collected"
          value={formatCurrency(s.payments.totalRevenue)}
          icon={Wallet}
          tone="success"
          hint={`${s.payments.pending} payment(s) pending`}
        />

        <StatCard
          title="Average rating"
          value={
            s.feedback.averageRating
              ? `${Number(s.feedback.averageRating).toFixed(1)} / 5`
              : "—"
          }
          icon={Star}
          tone="warning"
        />

        <StatCard
          title="Resolution rate"
          value={
            s.requests.total
              ? `${Math.round(
                  (((s.requests.byStatus.RESOLVED ?? 0) +
                    (s.requests.byStatus.CLOSED ?? 0)) /
                    s.requests.total) *
                    100,
                )}%`
              : "—"
          }
          icon={CircleCheck}
          tone="success"
          hint="Resolved or closed"
        />
      </div>

      <div className="mb-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Requests by status</CardTitle>
          </CardHeader>

          <CardContent>
            <div
              role="img"
              aria-label="Bar chart of request counts by status"
              className="h-80 w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={statusData}
                  layout="vertical"
                  margin={{ left: 8, right: 16 }}
                >
                  <CartesianGrid
                    horizontal={false}
                    stroke="var(--border)"
                    strokeDasharray="3 3"
                  />
                  <XAxis type="number" allowDecimals={false} tick={tick} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={110}
                    tick={tick}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    cursor={{ fill: "var(--muted)", opacity: 0.4 }}
                  />
                  <Bar
                    dataKey="value"
                    name="Requests"
                    fill="var(--chart-4)"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <table className="sr-only">
              <caption>Requests by status</caption>
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Requests</th>
                </tr>
              </thead>
              <tbody>
                {statusData.map((d) => (
                  <tr key={d.name}>
                    <td>{d.name}</td>
                    <td>{d.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Users by role</CardTitle>
          </CardHeader>

          <CardContent>
            <div
              role="img"
              aria-label="Donut chart of users by role"
              className="h-80 w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius="55%"
                    outerRadius="80%"
                    paddingAngle={2}
                  >
                    {userData.map((d) => (
                      <Cell key={d.name} fill={d.fill} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <table className="sr-only">
              <caption>Users by role</caption>
              <thead>
                <tr>
                  <th>Role</th>
                  <th>Users</th>
                </tr>
              </thead>
              <tbody>
                {userData.map((d) => (
                  <tr key={d.name}>
                    <td>{d.name}</td>
                    <td>{d.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Latest requests</CardTitle>
          <Link
            href="/admin/requests"
            className="text-xs font-medium text-primary underline-offset-4 hover:underline"
          >
            View all
          </Link>
        </CardHeader>

{deptData.length > 0 && (
  <Card className="mb-6">
    <CardHeader>
      <CardTitle>Requests by department</CardTitle>
    </CardHeader>
    <CardContent>
      <div
        role="img"
        aria-label="Bar chart of request counts by department"
        className="w-full"
        style={{ height: Math.max(deptData.length * 48, 160) }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={deptData}
            layout="vertical"
            margin={{ left: 8, right: 16 }}
          >
            <CartesianGrid
              horizontal={false}
              stroke="var(--border)"
              strokeDasharray="3 3"
            />
            <XAxis type="number" allowDecimals={false} tick={tick} />
            <YAxis type="category" dataKey="name" width={150} tick={tick} />
            <Tooltip
              contentStyle={tooltipStyle}
              cursor={{ fill: "var(--muted)", opacity: 0.4 }}
            />
            <Bar
              dataKey="value"
              name="Requests"
              fill="var(--chart-3)"
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <table className="sr-only">
        <caption>Requests by department</caption>
        <thead>
          <tr><th>Department</th><th>Requests</th></tr>
        </thead>
        <tbody>
          {deptData.map((d) => (
            <tr key={d.name}><td>{d.name}</td><td>{d.value}</td></tr>
          ))}
        </tbody>
      </table>
    </CardContent>
  </Card>
)}
        <CardContent>
          {recent.isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }, (_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (recent.data?.data ?? []).length === 0 ? (
            <EmptyState
              icon={Inbox}
              title="No requests yet"
              description="New requests will show up here."
            />
          ) : (
            <ul className="divide-y">
              {recent.data?.data.map((r) => (
                <li key={r.id}>
                  <Link
                    href={`/admin/requests/${r.id}`}
                    className="flex items-center justify-between gap-3 py-3 hover:bg-muted/50"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{r.title}</p>
                      <p className="font-mono text-xs text-muted-foreground">
                        {r.trackingRef} · {r.department?.name} ·{" "}
                        {formatDate(r.createdAt)}
                      </p>
                    </div>
                    <StatusBadge status={r.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
