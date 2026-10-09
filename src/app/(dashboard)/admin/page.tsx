
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { DashboardPageSkeleton } from "@/components/layout/dashboard/DashboardPageSkeleton";

export const metadata: Metadata = { title: "Overview" };

const AdminOverview = dynamic(
  () =>
    import("@/components/dashboard/AdminOverview").then(
      (module) => module.AdminOverview,
    ),
  {
    loading: () => <DashboardPageSkeleton />,
  },
);

export default function AdminDashboardPage() {
  return <AdminOverview />;
}
