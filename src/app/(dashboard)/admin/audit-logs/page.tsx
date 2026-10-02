import type { Metadata } from "next";
import { Suspense } from "react";
import { AuditLogList } from "@/components/admin/AuditLogList";
import { RequestListSkeleton } from "@/components/request/skeletons";
import { PageHeader } from "@/components/shared/PageHeader";

export const metadata: Metadata = { title: "Audit logs" };

export default function AdminAuditLogsPage() {
  return (
    <>
      <PageHeader
        title="Audit logs"
        description="Every administrative change, with before and after values."
      />
      <Suspense fallback={<RequestListSkeleton />}>
        <AuditLogList />
      </Suspense>
    </>
  );
}
