import type { Metadata } from "next";
import { Suspense } from "react";
import { CategoryManager } from "@/components/admin/CategoryManager";
import { RequestListSkeleton } from "@/components/request/skeletons";
import { PageHeader } from "@/components/shared/PageHeader";

export const metadata: Metadata = { title: "Categories" };

export default function AdminCategoriesPage() {
  return (
    <>
      <PageHeader
        title="Categories"
        description="Services citizens can request, with fees and deadlines."
      />
      <Suspense fallback={<RequestListSkeleton />}>
        <CategoryManager />
      </Suspense>
    </>
  );
}
