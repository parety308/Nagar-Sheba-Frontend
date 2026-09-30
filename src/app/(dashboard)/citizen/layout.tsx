import type { Metadata } from "next";
import type { ReactNode } from "react";
import { DashboardShell } from "@/components/layout/dashboard/DashboardShell";

export const metadata: Metadata = {
  title: { default: "Citizen", template: "%s | Nagar Sheba" },
  robots: { index: false },
};

export default function CitizenLayout({ children }: { children: ReactNode }) {
  return <DashboardShell userRole="CITIZEN">{children}</DashboardShell>;
}
