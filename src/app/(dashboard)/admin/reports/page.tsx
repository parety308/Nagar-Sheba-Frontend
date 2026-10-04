import type { Metadata } from "next";
import { ReportsView } from "@/components/admin/ReportsView";
import { PageHeader } from "@/components/shared/PageHeader";

export const metadata: Metadata = { title: "Reports" };

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