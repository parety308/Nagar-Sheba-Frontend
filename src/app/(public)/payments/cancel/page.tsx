import type { Metadata } from "next";
import { Suspense } from "react";
import { PaymentResult } from "@/components/payment/PaymentResult";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Payment cancelled",
  robots: { index: false },
};

export default function PaymentCancelPage() {
  return (
    <Suspense fallback={<Skeleton className="h-80 w-full rounded-xl" />}>
      <PaymentResult outcome="cancel" />
    </Suspense>
  );
}
