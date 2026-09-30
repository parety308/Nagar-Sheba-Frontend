import type { Metadata } from "next";
import type { ReactNode } from "react";
import { DashboardShell } from "@/components/layout/dashboard/DashboardShell";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Admin | Nagar Sheba" },
  robots: { index: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <DashboardShell userRole="ADMIN">{children}</DashboardShell>;
}
