
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { DashboardPageSkeleton } from "@/components/layout/dashboard/DashboardPageSkeleton";
import { PageHeader } from "@/components/shared/PageHeader";

export const metadata: Metadata = { title: "Performance" };

const StaffPerformanceView = dynamic(
  () =>
    import("@/components/staff/StaffPerformance").then(
      (module) => module.StaffPerformanceView,
    ),
  {
    loading: () => <DashboardPageSkeleton />,
  },
);

export default function StaffPerformancePage() {
  return (
    <>
      <PageHeader
        title="My performance"
        description="Resolved work, resolution speed and overdue items."
      />
      <StaffPerformanceView />
    </>
  );
}
