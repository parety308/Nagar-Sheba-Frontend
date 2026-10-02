import type { Metadata } from "next";
import { Suspense } from "react";
import { DepartmentManager } from "@/components/admin/DepartmentManager";
import { RequestListSkeleton } from "@/components/request/skeletons";
import { PageHeader } from "@/components/shared/PageHeader";

export const metadata: Metadata = { title: "Departments" };

export default function AdminDepartmentsPage() {
  return (
    <>
      <PageHeader
        title="Departments"
        description="Teams that own services and staff."
      />
      <Suspense fallback={<RequestListSkeleton />}>
        <DepartmentManager />
      </Suspense>
    </>
  );
}
