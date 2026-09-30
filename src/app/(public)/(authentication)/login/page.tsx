import type { Metadata } from "next";
import { Suspense } from "react";
import LoginForm from "@/components/form/LoginForm";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Sign in",
  description:
    "Sign in to Nagar Sheba to report and track city service requests.",
};

export default function LoginPage() {
  return (
    <Suspense fallback={<Skeleton className="h-[560px] w-full rounded-xl" />}>
      <LoginForm />
    </Suspense>
  );
}
