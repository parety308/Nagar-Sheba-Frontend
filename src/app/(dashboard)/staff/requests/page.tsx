import type { Metadata } from "next";
import { Suspense } from "react";
import { RequestList } from "@/components/request/RequestList";
import { RequestListSkeleton } from "@/components/request/skeletons";
import { PageHeader } from "@/components/shared/PageHeader";

export const metadata: Metadata = { title: "Request queue" };

export default function StaffRequestsPage() {
  return (
    <>
      <PageHeader
        title="Request queue"
        description="Requests for your department. Only requests assigned to you can be updated."
      />
      <Suspense fallback={<RequestListSkeleton />}>
        <RequestList basePath="/staff/requests" showAssignedFilter />
      </Suspense>
    </>
  );
}