"use client";

import { Download, Star, Timer, Wallet } from "lucide-react";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { StatCard } from "@/components/shared/StatCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardStats, useFeedbacks, usePayments } from "@/hook";
import { formatCurrency } from "@/lib/format";
import { REQUEST_STATUSES, STATUS_META } from "@/lib/status";
import type { Payment } from "@/types/payment.type";

const tooltipStyle = {
  background: "var(--popover)",
  color: "var(--popover-foreground)",
  border: "1px solid var(--border)",
  borderRadius: 8,
  fontSize: 12,
};
const tick = { fontSize: 11, fill: "var(--muted-foreground)" };

const PROVIDER_LABEL: Record<string, string> = {
  SSLCOMMERZ: "SSLCommerz",
  BKASH: "bKash",
};
const PROVIDER_FILL: Record<string, string> = {
  SSLCOMMERZ: "var(--chart-2)",
  BKASH: "var(--chart-5)",
};

const csvCell = (v: string | number | null) =>
  `"${String(v ?? "").replace(/"/g, '""')}"`;

function exportPaymentsCsv(payments: Payment[]) {
  const header = ["Reference", "Request", "Provider", "Amount", "Status", "Paid at"];
  const rows = payments.map((p) => [
    p.providerRef,
    p.request?.trackingRef ?? p.requestId,
    PROVIDER_LABEL[p.provider] ?? p.provider,
    p.amount,
    p.status,
    p.paidAt ?? "",
  ]);
  const csv = [header, ...rows].map((r) => r.map(csvCell).join(",")).join("\n");

  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = `payments-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function ChartBox({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div role="img" aria-label={label} className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        {children as React.ReactElement}
      </ResponsiveContainer>
    </div>
  );
}

export function ReportsView() {
  const stats = useDashboardStats();
  const payments = usePayments({
    status: "COMPLETED",
    limit: 100,
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const feedbacks = useFeedbacks({ limit: 100 });

  const paymentRows = payments.data?.data;
  const feedbackRows = feedbacks.data?.data;

  const revenueByProvider = useMemo(() => {
    const totals = new Map<string, number>();
    for (const p of paymentRows ?? []) {
      totals.set(p.provider, (totals.get(p.provider) ?? 0) + Number(p.amount));
    }
    return [...totals.entries()].map(([provider, value]) => ({
      name: PROVIDER_LABEL[provider] ?? provider,
      value,
      fill: PROVIDER_FILL[provider] ?? "var(--chart-1)",
    }));
  }, [paymentRows]);

  const ratingData = useMemo(
    () =>
      [5, 4, 3, 2, 1].map((n) => ({
        name: `${n} ★`,
        value: (feedbackRows ?? []).filter((f) => f.rating === n).length,
      })),
    [feedbackRows],
  );

  if (stats.isLoading) {
    return (
      <div aria-busy="true" className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }, (_, i) => (
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
  const total = s.requests.total;
  const onTimeRate = total
    ? Math.round(((total - s.requests.overdue) / total) * 100)
    : null;

  const statusData = REQUEST_STATUSES.map((key) => ({
    name: STATUS_META[key].label,
    value: s.requests.byStatus[key] ?? 0,
  }));

  const totalRevenue = revenueByProvider.reduce((sum, r) => sum + r.value, 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="On-time rate"
          value={onTimeRate === null ? "—" : `${onTimeRate}%`}
          icon={Timer}
          tone={onTimeRate !== null && onTimeRate < 80 ? "danger" : "success"}
          hint={`${s.requests.overdue} overdue of ${total}`}
        />
        <StatCard
          title="Revenue (latest 100 payments)"
          value={formatCurrency(totalRevenue)}
          icon={Wallet}
          tone="success"
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
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pipeline by status</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartBox label="Bar chart of requests by status">
              <BarChart data={statusData} margin={{ left: -16, right: 8 }}>
                <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={tick} interval={0} angle={-25} textAnchor="end" height={60} />
                <YAxis allowDecimals={false} tick={tick} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--muted)", opacity: 0.4 }} />
                <Bar dataKey="value" name="Requests" fill="var(--chart-4)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartBox>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Citizen ratings</CardTitle>
          </CardHeader>
          <CardContent>
            {feedbacks.isLoading ? (
              <Skeleton className="h-72 w-full" />
            ) : feedbacks.isError ? (
              <ErrorState error={feedbacks.error} onRetry={() => feedbacks.refetch()} />
            ) : (feedbackRows ?? []).length === 0 ? (
              <EmptyState icon={Star} title="No feedback yet" description="Ratings appear once citizens review resolved requests." />
            ) : (
              <ChartBox label="Bar chart of ratings">
                <BarChart data={ratingData} margin={{ left: -16, right: 8 }}>
                  <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={tick} />
                  <YAxis allowDecimals={false} tick={tick} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--muted)", opacity: 0.4 }} />
                  <Bar dataKey="value" name="Reviews" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartBox>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Revenue by payment provider</CardTitle>
          <Button
            variant="outline"
            className="h-9 gap-2"
            disabled={!paymentRows || paymentRows.length === 0}
            onClick={() => paymentRows && exportPaymentsCsv(paymentRows)}
          >
            <Download className="size-4" /> Export CSV
          </Button>
        </CardHeader>
        <CardContent>
          {payments.isLoading ? (
            <Skeleton className="h-72 w-full" />
          ) : payments.isError ? (
            <ErrorState error={payments.error} onRetry={() => payments.refetch()} />
          ) : revenueByProvider.length === 0 ? (
            <EmptyState icon={Wallet} title="No completed payments" description="Revenue shows up after the first paid request." />
          ) : (
            <div className="grid items-center gap-6 md:grid-cols-[1fr_auto]">
              <ChartBox label="Donut chart of revenue by provider">
                <PieChart>
                  <Pie data={revenueByProvider} dataKey="value" nameKey="name" innerRadius="55%" outerRadius="80%" paddingAngle={2}>
                    {revenueByProvider.map((d) => (
                      <Cell key={d.name} fill={d.fill} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} formatter={(v) => formatCurrency(Number(v))} />
                </PieChart>
              </ChartBox>
              <ul className="space-y-3 text-sm">
                {revenueByProvider.map((d) => (
                  <li key={d.name} className="flex items-center gap-3">
                    <span className="size-3 rounded-full" style={{ background: d.fill }} />
                    <span className="text-muted-foreground">{d.name}</span>
                    <span className="ml-auto font-semibold tabular-nums">{formatCurrency(d.value)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}