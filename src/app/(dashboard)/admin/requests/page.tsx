import type { Metadata } from "next";
import { Suspense } from "react";
import { RequestList } from "@/components/request/RequestList";
import { RequestListSkeleton } from "@/components/request/skeletons";
import { PageHeader } from "@/components/shared/PageHeader";

export const metadata: Metadata = { title: "Requests" };

export default function AdminRequestsPage() {
  return (
    <>
      <PageHeader
        title="All requests"
        description="Filter by department, deadline or assignment, then open a request to reassign or override it."
      />
      <Suspense fallback={<RequestListSkeleton />}>
        <RequestList basePath="/admin/requests" adminFilters />
      </Suspense>
    </>
  );
}