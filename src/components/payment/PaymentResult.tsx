"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Ban, CircleCheck, CircleX, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { AnimatedCheck } from "@/components/shared/AnimatedCheck";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { usePayments, useProfile } from "@/hook";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { getRoleHome } from "@/lib/roles";
import { cn } from "@/lib/utils";
import { ReceiptButton } from "./ReceiptButton";

type Outcome = "success" | "fail" | "cancel";

const PROVIDER_LABEL: Record<string, string> = {
  SSLCOMMERZ: "SSLCommerz",
  BKASH: "bKash",
};

const COPY: Record<
  Outcome,
  {
    icon: LucideIcon;
    tone: string;
    title: string;
    text: string;
  }
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

  const { data, isLoading, refetch } = usePayments({
    limit: 20,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  // Refresh request and notification data after returning from payment.
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["requests"] });
    queryClient.invalidateQueries({ queryKey: ["request"] });
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
  }, [queryClient]);

  const payment = ref
    ? data?.data.find((p) => p.providerRef === ref)
    : undefined;

  // The success redirect can arrive even when the server has not
  // finished processing the gateway callback/IPN.
  const effective: Outcome =
    outcome === "success" && payment?.status === "FAILED" ? "fail" : outcome;

  const confirming =
    outcome === "success" && payment?.status === "PENDING";

  // Poll while the payment is still pending.
  useEffect(() => {
    if (!confirming) return;

    const id = setInterval(() => {
      refetch();
    }, 3000);

    return () => clearInterval(id);
  }, [confirming, refetch]);

  const { icon: Icon, tone, title, text } = COPY[effective];

  const paid = payment?.status === "COMPLETED";

  return (
    <div className="rounded-xl border bg-card p-8 text-center shadow-lg">
      <div
        key={effective}
        className={cn(
          "mx-auto mb-4 flex size-16 animate-pop items-center justify-center rounded-full",
          tone,
        )}
      >
        {effective === "success" ? (
          <AnimatedCheck className="size-9" />
        ) : (
          <Icon className="size-8" />
        )}
      </div>

      <h1 className="text-xl font-semibold tracking-tight">
        {confirming ? "Confirming your payment" : title}
      </h1>

      <p className="mt-2 text-sm text-muted-foreground">
        {confirming
          ? "We're still waiting for the gateway to confirm. Check your request in a moment."
          : text}
      </p>

      {ref && (
        <div className="mt-6 animate-page-in rounded-lg border bg-muted/40 p-4 text-left text-sm">
          {isLoading ? (
            <Skeleton className="h-24 w-full" />
          ) : payment ? (
            <dl className="space-y-2">
              {payment.request && (
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Request</dt>
                  <dd className="font-mono text-xs font-medium">
                    {payment.request.trackingRef}
                  </dd>
                </div>
              )}

              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Amount</dt>
                <dd className="font-medium">
                  {formatCurrency(payment.amount)}
                </dd>
              </div>

              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Method</dt>
                <dd className="font-medium">
                  {PROVIDER_LABEL[payment.provider] ?? payment.provider}
                </dd>
              </div>

              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Status</dt>
                <dd>
                  <StatusBadge status={payment.status} />
                </dd>
              </div>

              {payment.paidAt && (
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Paid at</dt>
                  <dd className="font-medium">
                    {formatDateTime(payment.paidAt)}
                  </dd>
                </div>
              )}

              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Transaction ID</dt>
                <dd className="truncate font-mono text-xs">
                  {payment.providerRef}
                </dd>
              </div>
            </dl>
          ) : (
            <p className="break-all font-mono text-xs text-muted-foreground">
              Reference: {ref}
            </p>
          )}
        </div>
      )}

      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
        {payment && paid && (
          <ReceiptButton payment={payment} />
        )}

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
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-10 px-4",
          )}
        >
          {profile ? "Go to dashboard" : "Back to home"}
        </Link>
      </div>
    </div>
  );
}
