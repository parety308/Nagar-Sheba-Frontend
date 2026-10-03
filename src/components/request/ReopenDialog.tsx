"use client";

import { useForm } from "@tanstack/react-form";
import { RotateCcw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useReopenRequest } from "@/hook";
import { getApiErrorMessage } from "@/lib/api-error";
import { formatDateTime } from "@/lib/format";
import type { ServiceRequest } from "@/types/request.type";
import { ReopenRequestZodSchema } from "@/validation";

const REOPEN_WINDOW_MS = 3 * 24 * 60 * 60 * 1000;

export function ReopenDialog({ request }: { request: ServiceRequest }) {
  const [open, setOpen] = useState(false);
  const { mutate: reopen, isPending } = useReopenRequest();

  const deadline = request.resolvedAt
    ? new Date(new Date(request.resolvedAt).getTime() + REOPEN_WINDOW_MS)
    : null;

  const form = useForm({
    defaultValues: { reason: "" },
    validators: {
      onChange: ReopenRequestZodSchema,
      onSubmit: ReopenRequestZodSchema,
    },
    onSubmit: ({ value }) => {
      reopen(
        { id: request.id, payload: { reason: value.reason.trim() } },
        {
          onSuccess: () => {
            toast.success("Request reopened", {
              description: "It has been sent back to the department.",
            });
            form.reset();
            setOpen(false);
          },
          onError: (error) =>
            toast.error("Could not reopen request", {
              description: getApiErrorMessage(error),
            }),
        },
      );
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={<Button variant="outline" className="h-9 w-full gap-2" />}
      >
        <RotateCcw className="size-4" /> Reopen request
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reopen this request</DialogTitle>
          <DialogDescription>
            Tell the department what is still wrong.
            {deadline && ` You can reopen until ${formatDateTime(deadline)}.`}
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
                  <FieldLabel htmlFor={field.name}>Reason</FieldLabel>
                  <Textarea
                    id={field.name}
                    name={field.name}
                    rows={4}
                    placeholder="e.g. The pothole was patched but has reopened."
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <DialogFooter>
            <Button type="submit" disabled={isPending} className="h-9 px-4">
              {isPending ? (
                <>
                  <Spinner data-icon="inline-start" /> Reopening...
                </>
              ) : (
                "Reopen request"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
