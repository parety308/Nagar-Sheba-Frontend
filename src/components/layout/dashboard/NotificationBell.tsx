"use client";

import { Bell, BellOff } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useMarkAllNotificationsAsRead,
  useMarkNotificationAsRead,
  useNotifications,
  useUnreadNotificationCount,
} from "@/hook";
import { timeAgo } from "@/lib/format";
import { getRoleHome } from "@/lib/roles";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types/auth.type";

export function NotificationBell({ role }: { role: UserRole }) {
  const { data } = useUnreadNotificationCount();
  const count = data?.data.unreadCount ?? 0;
 const prev = useRef(count);
const [ring, setRing] = useState(false);

useEffect(() => {
  if (count > prev.current) {
    setRing(true);
    const t = setTimeout(() => setRing(false), 800);
    prev.current = count;
    return () => clearTimeout(t);
  }
  prev.current = count;
}, [count]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={
          count > 0 ? `Notifications, ${count} unread` : "Notifications"
        }
        className="relative flex size-9 items-center justify-center rounded-lg text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
      >
        <Bell className={cn("size-5", ring && "animate-bell")} />
{count > 0 && (
  <span
    key={count}
    className="absolute top-0.5 right-0.5 flex h-4 min-w-4 animate-pop items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-white"
  >
    {count > 99 ? "99+" : count}
  </span>
)}
      </DropdownMenuTrigger>

      {/* Content unmounts when closed, so the list only fetches on open */}
      <DropdownMenuContent align="end" className="w-80 p-0">
        <NotificationList role={role} unreadCount={count} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function NotificationList({
  role,
  unreadCount,
}: {
  role: UserRole;
  unreadCount: number;
}) {
  const { data, isLoading } = useNotifications({ limit: 5 });
  const { mutate: markRead } = useMarkNotificationAsRead();
  const { mutate: markAll, isPending } = useMarkAllNotificationsAsRead();

  const items = data?.data.notifications ?? [];

  return (
    <div>
      <div className="flex items-center justify-between border-b px-3 py-2.5">
        <p className="text-sm font-semibold">Notifications</p>

        <Button
          variant="ghost"
          size="sm"
          disabled={unreadCount === 0 || isPending}
          onClick={() => markAll()}
        >
          Mark all read
        </Button>
      </div>

      <div className="max-h-80 overflow-y-auto p-1">
        {isLoading ? (
          <div className="space-y-2 p-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-8 text-muted-foreground">
            <BellOff className="size-6" />
            <p className="text-xs">You're all caught up</p>
          </div>
        ) : (
          items.map((n) => (
            <DropdownMenuItem
              key={n.id}
              closeOnClick={false}
              onClick={() => !n.isRead && markRead(n.id)}
              className="items-start gap-2 py-2 whitespace-normal"
            >
              <span
                className={cn(
                  "mt-1.5 size-2 shrink-0 rounded-full",
                  n.isRead ? "bg-transparent" : "bg-primary",
                )}
              />

              <span className="flex-1">
                <span
                  className={cn(
                    "block text-xs leading-snug",
                    !n.isRead && "font-medium",
                  )}
                >
                  {n.message}
                </span>

                <span className="mt-0.5 block text-[10px] text-muted-foreground">
                  {timeAgo(n.createdAt)}
                </span>
              </span>
            </DropdownMenuItem>
          ))
        )}
      </div>

      <div className="border-t p-1">
        <DropdownMenuItem
          render={<Link href={`${getRoleHome(role)}/notifications`} />}
          className="justify-center text-primary"
        >
          View all notifications
        </DropdownMenuItem>
      </div>
    </div>
  );
}
