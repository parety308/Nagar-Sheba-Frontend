import type { Metadata } from "next";
import type { ReactNode } from "react";
import { DashboardShell } from "@/components/layout/dashboard/DashboardShell";

export const metadata: Metadata = {
  title: { default: "Staff", template: "%s | Staff | Nagar Sheba" },
  robots: { index: false },
};

export default function StaffLayout({ children }: { children: ReactNode }) {
  return <DashboardShell userRole="STAFF">{children}</DashboardShell>;
}
