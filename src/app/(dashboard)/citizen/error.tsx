"use client";

import { DashboardError } from "@/components/layout/dashboard/DashboardError";

export default function DashboardErrorBoundary(props: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <DashboardError {...props} />;
}
