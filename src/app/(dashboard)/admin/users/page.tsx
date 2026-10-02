import type { Metadata } from "next";
import { Suspense } from "react";
import { UserManager } from "@/components/admin/UserManager";
import { RequestListSkeleton } from "@/components/request/skeletons";
import { PageHeader } from "@/components/shared/PageHeader";

export const metadata: Metadata = { title: "Users & staff" };

export default function AdminUsersPage() {
  return (
    <>
      <PageHeader
        title="Users & staff"
        description="Manage accounts, roles and access."
      />
      <Suspense fallback={<RequestListSkeleton />}>
        <UserManager />
      </Suspense>
    </>
  );
}
