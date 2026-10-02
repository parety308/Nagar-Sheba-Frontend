import type { Metadata } from "next";
import { StaffOverview } from "@/components/dashboard/StaffOverview";

export const metadata: Metadata = { title: "Overview" };

export default function StaffDashboardPage() {
  return <StaffOverview />;
}
