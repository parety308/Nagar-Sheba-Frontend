import type { Metadata } from "next";
import { Suspense } from "react";
import { PaymentList } from "@/components/payment/PaymentList";
import { RequestListSkeleton } from "@/components/request/skeletons";
import { PageHeader } from "@/components/shared/PageHeader";

export const metadata: Metadata = { title: "Payments" };

export default function AdminPaymentsPage() {
  return (
    <>
      <PageHeader
        title="Payments"
        description="All transactions. Refund completed payments if needed."
      />
      <Suspense fallback={<RequestListSkeleton />}>
        <PaymentList requestBasePath="/admin/requests" canRefund />
      </Suspense>
    </>
  );
}
