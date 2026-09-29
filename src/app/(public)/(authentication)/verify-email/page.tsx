import type { Metadata } from "next";
import { Suspense } from "react";
import VerifyEmailForm from "@/components/form/VerifyEmailForm";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Verify email",
  description: "Verify your Nagar Sheba email address.",
};

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<Skeleton className="h-[380px] w-full rounded-xl" />}>
      <VerifyEmailForm />
    </Suspense>
  );
}