import type { Metadata } from "next";
import { StaffPerformanceView } from "@/components/staff/StaffPerformance";
import { PageHeader } from "@/components/shared/PageHeader";

export const metadata: Metadata = { title: "Performance" };

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