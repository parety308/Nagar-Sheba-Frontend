"use client";

import { useForm } from "@tanstack/react-form";
import { CheckCheck, Lock, Play } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useProfile, useUpdateRequestStatus } from "@/hook";
import { getApiErrorMessage } from "@/lib/api-error";
import type { ServiceRequest } from "@/types/request.type";
import { ResolveRequestZodSchema } from "@/validation";
import { AddEvidence } from "./AddEvidence";

const MAX_ATTACHMENTS = 5;

function ResolveForm({ request }: { request: ServiceRequest }) {
  const { mutate: update, isPending } = useUpdateRequestStatus();

  const form = useForm({
    defaultValues: { note: "" },
    validators: { onSubmit: ResolveRequestZodSchema },
    onSubmit: ({ value }) => {
      update(
        {
          id: request.id,
          payload: { toStatus: "RESOLVED", note: value.note.trim() },
        },
        {
          onSuccess: () => toast.success("Request marked as resolved"),
          onError: (error) =>
            toast.error("Could not resolve request", {
              description: getApiErrorMessage(error),
            }),
        },
      );
    },
  });

  return (
    <form
      noValidate
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <form.Field name="note">
        {(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field data-invalid={isInvalid} className="space-y-1.5">
              <FieldLabel htmlFor={field.name}>Resolution note</FieldLabel>
              <Textarea
                id={field.name}
                name={field.name}
                rows={4}
                placeholder="What was done to fix the problem?"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      </form.Field>

      <Button type="submit" disabled={isPending} className="h-9 w-full gap-2">
        {isPending ? (
          <>
            <Spinner data-icon="inline-start" /> Resolving...
          </>
        ) : (
          <>
            <CheckCheck className="size-4" /> Mark as resolved
          </>
        )}
      </Button>
    </form>
  );
}

export function StaffActions({ request }: { request: ServiceRequest }) {
  const { data: profile } = useProfile();
  const { mutate: update, isPending } = useUpdateRequestStatus();

  const isMine = !!profile && request.assignedStaffId === profile.id;
  const remaining = MAX_ATTACHMENTS - (request.attachments?.length ?? 0);

  if (!isMine) {
    return (
      <Card>
        <CardContent className="flex items-start gap-2 text-xs text-muted-foreground">
          <Lock className="mt-0.5 size-4 shrink-0" />
          {request.assignedStaffId
            ? "This request is assigned to another team member. You can view it but not change it."
            : "This request has not been assigned yet. An administrator will assign it."}
        </CardContent>
      </Card>
    );
  }

  const startWork = () =>
    update(
      { id: request.id, payload: { toStatus: "IN_PROGRESS" } },
      {
        onSuccess: () => toast.success("Work started"),
        onError: (error) =>
          toast.error("Could not start work", {
            description: getApiErrorMessage(error),
          }),
      },
    );

  const canUploadProof = ["ASSIGNED", "IN_PROGRESS", "RESOLVED"].includes(
    request.status,
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {request.status === "ASSIGNED" && (
            <Button
              className="h-9 w-full gap-2"
              disabled={isPending}
              onClick={startWork}
            >
              {isPending ? (
                <Spinner data-icon="inline-start" />
              ) : (
                <Play className="size-4" />
              )}
              Start work
            </Button>
          )}

          {request.status === "IN_PROGRESS" && (
            <ResolveForm request={request} />
          )}

          {!["ASSIGNED", "IN_PROGRESS"].includes(request.status) && (
            <p className="text-xs text-muted-foreground">
              No further action is needed from you on this request.
            </p>
          )}
        </CardContent>
      </Card>

      {canUploadProof && remaining > 0 && (
        <AddEvidence
          requestId={request.id}
          remaining={remaining}
          type="RESOLUTION_PROOF"
          title="Upload resolution proof"
        />
      )}
    </div>
  );
}
