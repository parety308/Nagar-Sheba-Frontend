import type { Metadata } from "next";
import { Suspense } from "react";
import { FeedbackList } from "@/components/admin/FeedbackList";
import { RequestListSkeleton } from "@/components/request/skeletons";
import { PageHeader } from "@/components/shared/PageHeader";

export const metadata: Metadata = { title: "Feedback" };

export default function AdminFeedbackPage() {
  return (
    <>
      <PageHeader
        title="Feedback"
        description="What citizens think of resolved requests."
      />
      <Suspense fallback={<RequestListSkeleton />}>
        <FeedbackList requestBasePath="/admin/requests" />
      </Suspense>
    </>
  );
}
