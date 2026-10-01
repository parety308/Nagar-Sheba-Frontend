"use client";

import { CreditCard, Smartphone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useCancelRequest, useInitiatePayment } from "@/hook";
import { getApiErrorMessage } from "@/lib/api-error";
import { formatCurrency } from "@/lib/format";
import type { PaymentProvider } from "@/types/payment.type";
import type { ServiceRequest } from "@/types/request.type";
import { AddEvidence } from "./AddEvidence";
import { ReopenDialog } from "./ReopenDialog";

const MAX_ATTACHMENTS = 5;
const REOPEN_WINDOW_MS = 3 * 24 * 60 * 60 * 1000;
const CANCELLABLE = ["PENDING_PAYMENT", "SUBMITTED", "ASSIGNED"];

export function CitizenActions({ request }: { request: ServiceRequest }) {
  const [cancelOpen, setCancelOpen] = useState(false);
  const { mutate: cancel, isPending: cancelling } = useCancelRequest();
  const {
    mutate: pay,
    isPending: paying,
    variables: payVariables,
  } = useInitiatePayment();

  const attachmentCount = request.attachments?.length ?? 0;
  const remaining = MAX_ATTACHMENTS - attachmentCount;

  const canPay = request.status === "PENDING_PAYMENT";
  const canCancel = CANCELLABLE.includes(request.status);
  const canReopen =
    request.status === "RESOLVED" &&
    !!request.resolvedAt &&
    Date.now() - new Date(request.resolvedAt).getTime() < REOPEN_WINDOW_MS;
  const canAddEvidence =
    request.status !== "CLOSED" &&
    request.status !== "CANCELLED" &&
    remaining > 0;

  const startPayment = (provider: PaymentProvider) => {
    pay(
      { requestId: request.id, provider },
      {
        onSuccess: ({ data }) => {
          toast.success("Redirecting to payment...");
          window.location.assign(data.checkoutUrl);
        },
        onError: (error) =>
          toast.error("Could not start payment", {
            description: getApiErrorMessage(error),
          }),
      },
    );
  };

  const confirmCancel = () => {
    cancel(request.id, {
      onSuccess: () => {
        toast.success("Request cancelled");
        setCancelOpen(false);
      },
      onError: (error) =>
        toast.error("Could not cancel request", {
          description: getApiErrorMessage(error),
        }),
    });
  };

  const hasAnyAction = canPay || canCancel || canReopen;

  return (
    <div className="space-y-6">
      {(hasAnyAction || request.status === "CLOSED") && (
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {canPay && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">
                  Pay {formatCurrency(request.feeCharged)} to start work on this
                  request.
                </p>
                <Button
                  className="h-9 w-full gap-2"
                  disabled={paying}
                  onClick={() => startPayment("SSLCOMMERZ")}
                >
                  {paying && payVariables?.provider === "SSLCOMMERZ" ? (
                    <Spinner data-icon="inline-start" />
                  ) : (
                    <CreditCard className="size-4" />
                  )}
                  Pay with SSLCommerz
                </Button>
                <Button
                  variant="outline"
                  className="h-9 w-full gap-2"
                  disabled={paying}
                  onClick={() => startPayment("BKASH")}
                >
                  {paying && payVariables?.provider === "BKASH" ? (
                    <Spinner data-icon="inline-start" />
                  ) : (
                    <Smartphone className="size-4" />
                  )}
                  Pay with bKash
                </Button>
              </div>
            )}

            {canReopen && <ReopenDialog request={request} />}

            {canCancel && (
              <AlertDialog open={cancelOpen} onOpenChange={setCancelOpen}>
                <AlertDialogTrigger
                  render={
                    <Button variant="destructive" className="h-9 w-full" />
                  }
                >
                  Cancel request
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Cancel this request?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This cannot be undone. If you already paid, a refund to
                      your original payment method is requested automatically.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={cancelling}>
                      Keep request
                    </AlertDialogCancel>
                    <AlertDialogAction
                      variant="destructive"
                      disabled={cancelling}
                      onClick={confirmCancel}
                    >
                      {cancelling ? "Cancelling..." : "Yes, cancel it"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            {request.status === "CLOSED" && (
              <p className="text-xs text-muted-foreground">
                This request is closed. File a new request if the problem comes
                back.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {canAddEvidence && (
        <AddEvidence requestId={request.id} remaining={remaining} />
      )}
    </div>
  );
}
