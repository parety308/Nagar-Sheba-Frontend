"use client";

import {
  CircleCheck,
  ClipboardList,
  CreditCard,
  FilePlus,
  Hourglass,
  Inbox,
} from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useProfile, useRequests } from "@/hook";
import { formatDate } from "@/lib/format";
import { getDisplayName } from "@/lib/user";
import { cn } from "@/lib/utils";

export function CitizenOverview() {
  const { data: profile } = useProfile();

  // limit=1 queries: we only need meta.total for each status
  const total = useRequests({ limit: 1 });
  const awaitingPayment = useRequests({ limit: 1, status: "PENDING_PAYMENT" });
  const inProgress = useRequests({ limit: 1, status: "IN_PROGRESS" });
  const resolved = useRequests({ limit: 1, status: "RESOLVED" });
  const recent = useRequests({ limit: 5 });

  const count = (q: typeof total) =>
    q.isLoading ? "…" : (q.data?.meta?.total ?? 0);

  const pendingCount = awaitingPayment.data?.meta?.total ?? 0;
  const name = getDisplayName(profile);

  return (
    <div>
      <PageHeader
        title={name ? `Welcome, ${name}` : "Welcome"}
        description="Here is where your requests stand."
        actions={
          <Link
            href="/citizen/requests/new"
            className={cn(buttonVariants(), "h-9 gap-2 px-4")}
          >
            <FilePlus className="size-4" /> New request
          </Link>
        }
      />

      {pendingCount > 0 && (
        <Link
          href="/citizen/requests?status=PENDING_PAYMENT"
          className="mb-6 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 hover:bg-amber-100 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200"
        >
          <CreditCard className="size-4 shrink-0" />
          {pendingCount} request{pendingCount === 1 ? " is" : "s are"} waiting
          for payment. Review now
        </Link>
      )}

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total requests"
          value={count(total)}
          icon={ClipboardList}
        />
        <StatCard
          title="Awaiting payment"
          value={count(awaitingPayment)}
          icon={CreditCard}
          tone="warning"
        />
        <StatCard
          title="In progress"
          value={count(inProgress)}
          icon={Hourglass}
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
          <CardTitle>Recent requests</CardTitle>
          <Link
            href="/citizen/requests"
            className="text-xs font-medium text-primary underline-offset-4 hover:underline"
          >
            View all
          </Link>
        </CardHeader>
        <CardContent>
          {recent.isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }, (_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : recent.isError ? (
            <ErrorState error={recent.error} onRetry={() => recent.refetch()} />
          ) : (recent.data?.data ?? []).length === 0 ? (
            <EmptyState
              icon={Inbox}
              title="No requests yet"
              description="Report an issue and it will show up here."
            />
          ) : (
            <ul className="divide-y">
              {recent.data?.data.map((r) => (
                <li key={r.id}>
                  <Link
                    href={`/citizen/requests/${r.id}`}
                    className="flex items-center justify-between gap-3 py-3 hover:bg-muted/50"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{r.title}</p>
                      <p className="font-mono text-xs text-muted-foreground">
                        {r.trackingRef} · {formatDate(r.createdAt)}
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
