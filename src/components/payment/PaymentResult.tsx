"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Ban, CircleCheck, CircleX, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { usePayments, useProfile } from "@/hook";
import { formatCurrency } from "@/lib/format";
import { getRoleHome } from "@/lib/roles";
import { cn } from "@/lib/utils";

type Outcome = "success" | "fail" | "cancel";

const COPY: Record<
  Outcome,
  { icon: LucideIcon; tone: string; title: string; text: string }
> = {
  success: {
    icon: CircleCheck,
    tone: "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-300",
    title: "Payment successful",
    text: "Your payment was verified and your request has been submitted to the department.",
  },
  fail: {
    icon: CircleX,
    tone: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300",
    title: "Payment failed",
    text: "We could not verify your payment. Your request is still waiting; you can try again from the request page.",
  },
  cancel: {
    icon: Ban,
    tone: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
    title: "Payment cancelled",
    text: "You cancelled the payment. Your request stays in Pending Payment until you pay or cancel it.",
  },
};

export function PaymentResult({ outcome }: { outcome: Outcome }) {
  const params = useSearchParams();
  const queryClient = useQueryClient();
  const ref = params.get("tran_id") ?? params.get("paymentID");

  const { data: profile } = useProfile();
  const { data, isLoading } = usePayments({
    limit: 20,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  // The backend already updated the request; make sure cached data is refreshed.
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["requests"] });
    queryClient.invalidateQueries({ queryKey: ["request"] });
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
  }, [queryClient]);

  const payment = ref
    ? data?.data.find((p) => p.providerRef === ref)
    : undefined;

  const { icon: Icon, tone, title, text } = COPY[outcome];

  return (
    <div className="rounded-xl border bg-card p-8 text-center shadow-lg">
      <div
        className={cn(
          "mx-auto mb-4 flex size-16 items-center justify-center rounded-full",
          tone,
        )}
      >
        <Icon className="size-8" />
      </div>
      <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{text}</p>

      {ref && (
        <div className="mt-6 rounded-lg border bg-muted/40 p-4 text-left text-sm">
          {isLoading ? (
            <Skeleton className="h-12 w-full" />
          ) : payment ? (
            <dl className="space-y-2">
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Amount</dt>
                <dd className="font-medium">
                  {formatCurrency(payment.amount)}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Status</dt>
                <dd>
                  <StatusBadge status={payment.status} />
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Reference</dt>
                <dd className="truncate font-mono text-xs">
                  {payment.providerRef}
                </dd>
              </div>
            </dl>
          ) : (
            <p className="font-mono text-xs break-all text-muted-foreground">
              Reference: {ref}
            </p>
          )}
        </div>
      )}

      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
        {payment && (
          <Link
            href={`/citizen/requests/${payment.requestId}`}
            className={cn(buttonVariants(), "h-10 px-4")}
          >
            View request
          </Link>
        )}
        <Link
          href={profile ? getRoleHome(profile.role) : "/"}
          className={cn(buttonVariants({ variant: "outline" }), "h-10 px-4")}
        >
          {profile ? "Go to dashboard" : "Back to home"}
        </Link>
      </div>
    </div>
  );
}
