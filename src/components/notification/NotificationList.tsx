"use client";

import { BellOff, CheckCheck } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Pagination } from "@/components/shared/Pagination";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useMarkAllNotificationsAsRead,
  useMarkNotificationAsRead,
  useNotifications,
  useUrlState,
} from "@/hook";
import { formatDateTime, timeAgo, toEnumLabel } from "@/lib/format";
import { cn } from "@/lib/utils";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "unread", label: "Unread" },
] as const;

export function NotificationList() {
  const { get, getNumber, setParams } = useUrlState();
  const page = getNumber("page", 1);
  const filter = get("filter", "all");

  const { data, isLoading, isError, error, refetch } = useNotifications({
    page,
    limit: 10,
    isRead: filter === "unread" ? false : undefined,
  });
  const { mutate: markRead } = useMarkNotificationAsRead();
  const { mutate: markAll, isPending: markingAll } =
    useMarkAllNotificationsAsRead();

  const items = data?.data.notifications ?? [];
  const unreadCount = data?.data.unreadCount ?? 0;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2" role="group" aria-label="Filter">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              aria-pressed={filter === f.value}
              onClick={() => setParams({ filter: f.value })}
              className={cn(
                "rounded-full border px-4 py-1.5 text-xs font-medium transition-colors",
                filter === f.value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "hover:bg-muted",
              )}
            >
              {f.label}
              {f.value === "unread" && unreadCount > 0 && ` (${unreadCount})`}
            </button>
          ))}
        </div>

        <Button
          variant="outline"
          className="h-9 gap-2"
          disabled={unreadCount === 0 || markingAll}
          onClick={() => markAll()}
        >
          <CheckCheck className="size-4" /> Mark all as read
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-2" aria-busy="true">
          {Array.from({ length: 6 }, (_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState error={error} onRetry={() => refetch()} />
      ) : items.length === 0 ? (
        <EmptyState
          icon={BellOff}
          title={
            filter === "unread"
              ? "No unread notifications"
              : "You're all caught up"
          }
          description="Updates about your requests and payments will appear here."
        />
      ) : (
        <>
          <Card className="divide-y gap-0 py-0">
            {items.map((n) => (
              <div
                key={n.id}
                className={cn(
                  "flex items-start gap-3 px-4 py-3.5",
                  !n.isRead && "bg-primary/5",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "mt-1.5 size-2 shrink-0 rounded-full",
                    n.isRead ? "bg-transparent" : "bg-primary",
                  )}
                />
                <div className="min-w-0 flex-1">
                  <p className={cn("text-sm", !n.isRead && "font-medium")}>
                    {n.message}
                  </p>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {toEnumLabel(n.type)} · {timeAgo(n.createdAt)} ·{" "}
                    {formatDateTime(n.createdAt)}
                  </p>
                </div>
                {!n.isRead && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => markRead(n.id)}
                  >
                    Mark read
                  </Button>
                )}
              </div>
            ))}
          </Card>
          <Pagination meta={data?.meta} />
        </>
      )}
    </div>
  );
}
