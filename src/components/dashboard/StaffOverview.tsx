"use client";

import { AlarmClock, CircleCheck, Hourglass, Inbox, Play } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useProfile, useRequests } from "@/hook";
import { formatDateTime } from "@/lib/format";
import { getDisplayName } from "@/lib/user";

export function StaffOverview() {
  const { data: profile } = useProfile();

  // limit=1 queries: only meta.total is needed
  const toStart = useRequests({ limit: 1, assigned: "me", status: "ASSIGNED" });
  const inProgress = useRequests({
    limit: 1,
    assigned: "me",
    status: "IN_PROGRESS",
  });
  const overdue = useRequests({ limit: 1, assigned: "me", overdue: true });
  const resolved = useRequests({
    limit: 1,
    assigned: "me",
    status: "RESOLVED",
  });
  const needsAction = useRequests({
    limit: 5,
    assigned: "me",
    status: "ASSIGNED",
    sortBy: "slaDueAt",
    sortOrder: "asc",
  });

  const count = (q: typeof toStart) =>
    q.isLoading ? "…" : (q.data?.meta?.total ?? 0);

  const name = getDisplayName(profile);
  const department = profile?.staffProfile?.department?.name;

  return (
    <div>
      <PageHeader
        title={name ? `Welcome, ${name}` : "Welcome"}
        description={
          department
            ? `${department} department queue`
            : "Your assigned work at a glance."
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Waiting to start" value={count(toStart)} icon={Play} />
        <StatCard
          title="In progress"
          value={count(inProgress)}
          icon={Hourglass}
        />
        <StatCard
          title="Overdue"
          value={count(overdue)}
          icon={AlarmClock}
          tone="danger"
        />
        <StatCard
          title="Resolved"
          value={count(resolved)}
          icon={CircleCheck}
          tone="success"
        />
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Needs your action</CardTitle>
          <Link
            href="/staff/requests?assigned=me"
            className="text-xs font-medium text-primary underline-offset-4 hover:underline"
          >
            View all mine
          </Link>
        </CardHeader>
        <CardContent>
          {needsAction.isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }, (_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : needsAction.isError ? (
            <ErrorState
              error={needsAction.error}
              onRetry={() => needsAction.refetch()}
            />
          ) : (needsAction.data?.data ?? []).length === 0 ? (
            <EmptyState
              icon={Inbox}
              title="Nothing waiting"
              description="Requests assigned to you will appear here."
            />
          ) : (
            <ul className="divide-y">
              {needsAction.data?.data.map((r) => (
                <li key={r.id}>
                  <Link
                    href={`/staff/requests/${r.id}`}
                    className="flex items-center justify-between gap-3 py-3 hover:bg-muted/50"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{r.title}</p>
                      <p className="font-mono text-[11px] text-muted-foreground">
                        {r.trackingRef} · due {formatDateTime(r.slaDueAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {r.isOverdue && (
                        <Badge variant="destructive">Overdue</Badge>
                      )}
                      <StatusBadge status={r.status} />
                    </div>
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
