"use client";

import { useForm } from "@tanstack/react-form";
import { Undo2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useRefundPayment } from "@/hook";
import { getApiErrorMessage } from "@/lib/api-error";
import { formatCurrency } from "@/lib/format";
import type { Payment } from "@/types/payment.type";
import { RefundZodSchema } from "@/validation";

export function RefundDialog({ payment }: { payment: Payment }) {
  const [open, setOpen] = useState(false);
  const { mutate: refund, isPending } = useRefundPayment();

  const form = useForm({
    defaultValues: { reason: "" },
    validators: { onSubmit: RefundZodSchema },
    onSubmit: ({ value }) => {
      // Always send an object: the API validates the body and Express 5
      // leaves req.body undefined when nothing is sent.
      refund(
        {
          id: payment.id,
          payload: { reason: value.reason.trim() || undefined },
        },
        {
          onSuccess: () => {
            toast.success("Payment refunded");
            setOpen(false);
          },
          onError: (error) =>
            toast.error("Refund failed", {
              description: getApiErrorMessage(error),
            }),
        },
      );
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
        <Undo2 /> Refund
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Refund {formatCurrency(payment.amount)}?</DialogTitle>
          <DialogDescription>
            The amount goes back to the original payment method through{" "}
            {payment.provider === "BKASH" ? "bKash" : "SSLCommerz"}. Use this to
            retry a failed automatic refund.
          </DialogDescription>
        </DialogHeader>
        <form
          noValidate
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <form.Field name="reason">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid} className="space-y-1.5">
                  <FieldLabel htmlFor={field.name}>
                    Reason (optional)
                  </FieldLabel>
                  <Textarea
                    id={field.name}
                    rows={3}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
          <Button
            type="submit"
            variant="destructive"
            disabled={isPending}
            className="h-9 w-full"
          >
            {isPending ? (
              <>
                <Spinner data-icon="inline-start" /> Refunding...
              </>
            ) : (
              "Confirm refund"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
