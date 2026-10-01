import type { Metadata } from "next";
import { Suspense } from "react";
import { NotificationList } from "@/components/notification/NotificationList";
import { PageHeader } from "@/components/shared/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = { title: "Notifications" };

export default function NotificationsPage() {
  return (
    <>
      <PageHeader
        title="Notifications"
        description="Status changes, assignments and payment updates."
      />
      <Suspense fallback={<Skeleton className="h-96 w-full rounded-xl" />}>
        <NotificationList />
      </Suspense>
    </>
  );
}
