
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { DashboardPageSkeleton } from "@/components/layout/dashboard/DashboardPageSkeleton";
import { PageHeader } from "@/components/shared/PageHeader";

export const metadata: Metadata = { title: "Reports" };

const ReportsView = dynamic(
  () =>
    import("@/components/admin/ReportsView").then(
      (module) => module.ReportsView,
    ),
  {
    loading: () => <DashboardPageSkeleton />,
  },
);

export default function AdminReportsPage() {
  return (
    <>
      <PageHeader
        title="Reports"
        description="Service performance, revenue and citizen satisfaction. Revenue and ratings use the latest 100 records."
      />
      <ReportsView />
    </>
  );
}
