import type { Metadata } from "next";
import { CitizenOverview } from "@/components/dashboard/CitizenOverview";

export const metadata: Metadata = { title: "Overview" };

export default function CitizenDashboardPage() {
  return <CitizenOverview />;
}
