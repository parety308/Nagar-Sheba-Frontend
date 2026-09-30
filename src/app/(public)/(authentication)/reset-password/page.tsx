import type { Metadata } from "next";
import { Suspense } from "react";
import ResetPasswordForm from "@/components/form/ResetPasswordForm";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Reset password",
  description: "Set a new Nagar Sheba password.",
};

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<Skeleton className="h-[440px] w-full rounded-xl" />}>
      <ResetPasswordForm />
    </Suspense>
  );
}