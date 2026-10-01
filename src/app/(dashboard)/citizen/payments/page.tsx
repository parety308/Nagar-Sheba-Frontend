import type { Metadata } from "next";
import { Suspense } from "react";
import { PaymentList } from "@/components/payment/PaymentList";
import { RequestListSkeleton } from "@/components/request/skeletons";
import { PageHeader } from "@/components/shared/PageHeader";

export const metadata: Metadata = { title: "Payments" };

export default function CitizenPaymentsPage() {
  return (
    <>
      <PageHeader
        title="Payments"
        description="Fees you've paid for permits and paid services."
      />
      <Suspense fallback={<RequestListSkeleton />}>
        <PaymentList requestBasePath="/citizen/requests" />
      </Suspense>
    </>
  );
}
</parameter>
